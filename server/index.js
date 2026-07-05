import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "server", "data");
const uploadDir = path.join(root, "server", "uploads");
const imageUploadDir = path.join(uploadDir, "images");
const dataFile = path.join(dataDir, "content.json");
const dbFile = path.join(dataDir, "site.db");
const adminUser = process.env.ADMIN_USER || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
const sessions = new Map();

const app = express();
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, file, cb) => cb(null, file.fieldname === "attachment" ? uploadDir : imageUploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase() || ".bin";
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "attachment" || file.mimetype?.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Only image uploads are allowed."));
  },
  limits: { fileSize: 8 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadDir));

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadDir, { recursive: true });
  await mkdir(imageUploadDir, { recursive: true });
}

function createDatabase() {
  const database = new DatabaseSync(dbFile);
  database.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new'
    );
  `);
  return database;
}

function readSeedContent() {
  if (existsSync(dataFile)) {
    const text = readFileSync(dataFile, "utf8").replace(/^\uFEFF/, "");
    try {
      return JSON.parse(text);
    } catch {
      return seedContent;
    }
  }
  return seedContent;
}

function ensureInitialContent() {
  const existing = db.prepare("SELECT value FROM site_content WHERE key = ?").get("main");
  if (existing) return;
  const seed = readSeedContent();
  const seedInquiries = Array.isArray(seed.inquiries) ? seed.inquiries : [];
  seed.inquiries = [];
  seed.updatedAt = new Date().toISOString();
  db.prepare("INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, ?)").run(
    "main",
    JSON.stringify(seed),
    seed.updatedAt
  );
  const insertInquiry = db.prepare("INSERT OR IGNORE INTO inquiries (id, payload, created_at, status) VALUES (?, ?, ?, ?)");
  for (const inquiry of seedInquiries) {
    const next = {
      id: inquiry.id || `inq-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      createdAt: inquiry.createdAt || new Date().toISOString(),
      status: inquiry.status || "new",
      ...inquiry
    };
    insertInquiry.run(next.id, JSON.stringify(next), next.createdAt, next.status);
  }
}

function readContent() {
  const row = db.prepare("SELECT value FROM site_content WHERE key = ?").get("main");
  const content = row ? JSON.parse(row.value) : readSeedContent();
  content.inquiries = readInquiries();
  return content;
}

function readPublicContent() {
  const content = readContent();
  return { ...content, inquiries: [] };
}

function writeContent(content) {
  const next = { ...content, inquiries: [] };
  next.updatedAt = new Date().toISOString();
  db.prepare(`
    INSERT INTO site_content (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run("main", JSON.stringify(next), next.updatedAt);
  return readContent();
}

function readInquiries() {
  return db.prepare("SELECT payload FROM inquiries ORDER BY created_at DESC").all().map((row) => JSON.parse(row.payload));
}

function saveInquiry(inquiry) {
  db.prepare("INSERT INTO inquiries (id, payload, created_at, status) VALUES (?, ?, ?, ?)").run(
    inquiry.id,
    JSON.stringify(inquiry),
    inquiry.createdAt,
    inquiry.status
  );
}

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getBearerToken(req) {
  const value = req.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token || !sessions.has(token)) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== adminUser || password !== adminPassword) {
    res.status(401).json({ ok: false, error: "Invalid username or password" });
    return;
  }
  const token = makeToken();
  sessions.set(token, { username, createdAt: new Date().toISOString() });
  res.json({ ok: true, token, user: { username } });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  sessions.delete(getBearerToken(req));
  res.json({ ok: true });
});

app.get("/api/content", (_req, res) => {
  res.json(readPublicContent());
});

app.get("/api/admin/content", requireAuth, (_req, res) => {
  res.json(readContent());
});

app.put("/api/content", requireAuth, (req, res) => {
  const content = writeContent(req.body);
  res.json({ ok: true, content });
});

app.post("/api/admin/content", requireAuth, (req, res) => {
  const content = writeContent(req.body);
  res.json({ ok: true, content });
});

app.post("/api/admin/uploads", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ ok: false, error: "No image uploaded" });
    return;
  }
  res.json({
    ok: true,
    file: {
      originalName: req.file.originalname,
      path: `/uploads/images/${req.file.filename}`
    }
  });
});

app.post("/api/inquiries", upload.single("attachment"), (req, res) => {
  const inquiry = {
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
    ...req.body,
    attachment: req.file
      ? {
          originalName: req.file.originalname,
          path: `/uploads/${req.file.filename}`
        }
      : null
  };
  saveInquiry(inquiry);
  res.json({ ok: true, inquiry });
});

const seedContent = {
  updatedAt: new Date().toISOString(),
  settings: {
    shopUrl: "https://shop29l50769091n2.1688.com/",
    brand: {
      zh: "昂越体育智能制造",
      en: "Angyue Intelligent Sports Manufacturing"
    },
    company: {
      zh: "义乌昂越体育用品有限公司",
      en: "Yiwu Angyue Sports Goods Co., Ltd"
    },
    phone: "+86 15037096254",
    email: "sales@angyuesports.com",
    whatsapp: "+86 15037096254",
    address: {
      zh: "浙江省义乌市北苑街道凌云五区",
      en: "Lingyun 5th District, Beiyuan Street, Yiwu, Zhejiang, China"
    }
  },
  seo: {
    title: {
      zh: "高端体育器材智能制造官网",
      en: "Premium Sports Equipment Intelligent Manufacturing"
    },
    description: {
      zh: "专注蹦床与体育器材的高端制造、AI 智能检测、大数据迭代与 OEM/ODM 定制。",
      en: "Premium trampoline and sports equipment manufacturer with AI inspection, data-driven iteration and OEM/ODM service."
    }
  },
  banners: [
    {
      id: "b1",
      image: "/assets/1688/shop-hero-02.jpg",
      kicker: { zh: "智能制造", en: "Intelligent Manufacturing" },
      title: {
        zh: "以科技智造，铸就工程级体育器材品质",
        en: "Engineering-grade sports equipment powered by intelligent manufacturing"
      },
      subtitle: {
        zh: "自研设计、自动化生产、AI 智能检测、大数据迭代，为全球客户提供稳定可靠的制造服务。",
        en: "Self-developed design, automated production, AI inspection and data-driven iteration for global buyers."
      }
    },
    {
      id: "b2",
      image: "/assets/1688/shop-hero-01.jpg",
      kicker: { zh: "品牌背书", en: "Certified Quality" },
      title: { zh: "证书、检测与专利背书的可信工厂", en: "A trusted factory backed by certificates, tests and patents" },
      subtitle: { zh: "面向品牌代理、工程采购、连锁客户与外贸订单，建立长期稳定合作。", en: "Built for brand distributors, project buyers, chains and export orders." }
    },
    {
      id: "b3",
      image: "/assets/1688/shop-product-03.jpg",
      kicker: { zh: "产品矩阵", en: "Product Portfolio" },
      title: { zh: "儿童蹦床、健身蹦床与户外组合产品", en: "Kids, fitness and outdoor trampoline systems" },
      subtitle: { zh: "规格、颜色、包装与功能组合灵活，支持 OEM/ODM 定制开发。", en: "Flexible specs, colors, packaging and feature combinations for OEM/ODM programs." }
    },
    {
      id: "b4",
      image: "/assets/1688/shop-product-04.jpg",
      kicker: { zh: "数据迭代", en: "Data Iteration" },
      title: { zh: "用真实场景数据推动下一代产品升级", en: "Real usage data drives next-generation product upgrades" },
      subtitle: { zh: "结合售后反馈、损耗规律与场景需求，持续优化安全性、耐用度与体验。", en: "After-sales feedback and usage patterns improve safety, durability and experience." }
    }
  ],
  stats: [
    { label: { zh: "工厂面积", en: "Factory Area" }, value: "15,000m²" },
    { label: { zh: "员工规模", en: "Team Members" }, value: "180+" },
    { label: { zh: "核心品类", en: "Product Lines" }, value: "8+" },
    { label: { zh: "出口市场", en: "Export Markets" }, value: "30+" },
    { label: { zh: "OEM/ODM", en: "OEM/ODM" }, value: "Yes" },
    { label: { zh: "证书专利", en: "Certificates" }, value: "20+" }
  ],
  values: [
    { title: { zh: "高端品质", en: "Premium Quality" }, body: { zh: "从原材料、焊接、喷涂到装配建立全流程标准。", en: "Full-process standards from materials, welding and coating to assembly." } },
    { title: { zh: "自主研发", en: "Independent R&D" }, body: { zh: "结构工程与工业设计团队支持新品开发。", en: "Engineering and industrial design teams support new product development." } },
    { title: { zh: "AI 智能检测", en: "AI Inspection" }, body: { zh: "围绕瑕疵、变形、漏焊、色差进行辅助识别。", en: "Assisted recognition for defects, deformation, missed welds and color difference." } },
    { title: { zh: "大数据迭代", en: "Data Iteration" }, body: { zh: "通过使用反馈和售后数据反向优化产品结构。", en: "Usage feedback and after-sales data improve structure and durability." } }
  ],
  categories: [
    { id: "kids", name: { zh: "儿童蹦床", en: "Kids Trampolines" } },
    { id: "indoor", name: { zh: "室内蹦床", en: "Indoor Trampolines" } },
    { id: "outdoor", name: { zh: "户外蹦床", en: "Outdoor Trampolines" } },
    { id: "fitness", name: { zh: "健身蹦床", en: "Fitness Trampolines" } },
    { id: "combo", name: { zh: "组合款蹦床", en: "Combo Styles" } },
    { id: "swing", name: { zh: "秋千 / 吊篮", en: "Swings & Baskets" } }
  ],
  products: [
    {
      id: "p1",
      category: "kids",
      featured: true,
      image: "/assets/1688/shop-product-03.jpg",
      name: { zh: "儿童加固款安全蹦床", en: "Reinforced Kids Safety Trampoline" },
      summary: { zh: "三层稳固框架，适合家庭、校园与儿童乐园。", en: "Triple reinforced frame for homes, schools and play areas." },
      specs: {
        diameter: "1.2m / 1.4m / 1.5m",
        package: "88 x 31 x 25cm",
        weight: "11.5kg / 12.5kg / 14kg",
        color: "Red / Yellow / Blue"
      }
    },
    {
      id: "p2",
      category: "combo",
      featured: true,
      image: "/assets/1688/shop-product-04.jpg",
      name: { zh: "横杆组合款蹦床", en: "Horizontal Bar Combo Trampoline" },
      summary: { zh: "可搭配吊环、篮球框与安全围网。", en: "Configurable with rings, basket hoop and safety net." },
      specs: {
        diameter: "1.0m / 1.2m / 1.4m / 1.5m",
        package: "88 x 28 x 24cm",
        weight: "12kg - 15.5kg",
        color: "Red / Yellow / Blue"
      }
    },
    {
      id: "p3",
      category: "fitness",
      featured: true,
      image: "/assets/1688/shop-product-05.jpg",
      name: { zh: "健身与娱乐商用蹦床", en: "Commercial Fitness & Entertainment Trampoline" },
      summary: { zh: "适合健身房、亲子空间与高频商业使用场景。", en: "For gyms, family entertainment areas and high-frequency commercial use." },
      specs: {
        diameter: "1.0m / 1.2m / 1.4m",
        package: "87 x 26 x 17cm",
        weight: "7.7kg / 8.2kg / 8.5kg",
        color: "Red / Yellow / Blue"
      }
    }
  ],
  manufacturing: [
    { zh: "自动切割", en: "Auto Cutting" },
    { zh: "自动折弯", en: "Auto Bending" },
    { zh: "机械臂焊接", en: "Robotic Welding" },
    { zh: "自动喷涂", en: "Auto Coating" },
    { zh: "自动组装", en: "Auto Assembly" },
    { zh: "智能质检", en: "Smart Inspection" }
  ],
  ai: [
    { zh: "AI 力学测算", en: "AI Mechanical Simulation" },
    { zh: "AI 承重分析", en: "AI Load Analysis" },
    { zh: "AI 结构优化", en: "AI Structure Optimization" },
    { zh: "AI 瑕疵识别", en: "AI Defect Recognition" },
    { zh: "AI 色差检测", en: "AI Color Difference Check" },
    { zh: "AI 质检辅助", en: "AI Quality Assistance" }
  ],
  certificates: [
    { title: { zh: "CE 认证", en: "CE Certification" }, image: "/assets/catalog-page-01.png" },
    { title: { zh: "检测报告", en: "Test Reports" }, image: "/assets/catalog-page-01.png" },
    { title: { zh: "专利证书", en: "Patent Certificates" }, image: "/assets/catalog-page-01.png" }
  ],
  news: [
    { id: "n1", date: "2026-07-03", title: { zh: "昂越体育智能制造官网项目启动", en: "Angyue intelligent manufacturing website project launched" }, body: { zh: "官网将重点展示产品、工厂、研发和智能制造能力。", en: "The website will present products, factory, R&D and intelligent manufacturing capabilities." } }
  ],
  inquiries: []
};

await ensureStorage();
const db = createDatabase();
ensureInitialContent();

app.listen(4000, () => {
  console.log("API server running at http://localhost:4000");
});
