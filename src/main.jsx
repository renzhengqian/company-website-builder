import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Copy,
  Cpu,
  ExternalLink,
  Factory,
  Globe2,
  Hammer,
  Mail,
  Menu,
  MessageSquareText,
  PackageCheck,
  Phone,
  Paintbrush,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Scissors,
  Sparkles,
  Truck,
  Warehouse,
  Wrench,
  X
} from "lucide-react";
import "./styles.css";

const t = (value, lang) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.zh || value.en || "";
};

const uiText = {
  shopOrder: { zh: "1688下单", en: "Order on 1688" },
  shopAddress: { zh: "1688 下单地址", en: "1688 Order URL" },
  open1688: { zh: "打开 1688", en: "Open 1688" },
  copyAddress: { zh: "复制地址", en: "Copy URL" },
  copied: { zh: "地址已复制", en: "URL copied" },
  inquiry: { zh: "立即询盘", en: "Inquiry" },
  call: { zh: "电话", en: "Call" },
  products: { zh: "产品", en: "Products" },
  language: { zh: "EN", en: "CN" },
  cmsAdmin: { zh: "CMS 后台", en: "CMS Admin" },
  contentManagement: { zh: "内容管理", en: "Content management" },
  viewSite: { zh: "查看前台", en: "View Site" },
  backendCms: { zh: "后台管理", en: "Backend CMS" },
  adminTitle: { zh: "官网内容管理后台", en: "Website Content Admin" },
  adminIntro: {
    zh: "编辑内容后保存，前台刷新即可同步。可维护 Banner、产品、新闻、证书、联系方式、SEO、1688 下单地址和询盘记录。",
    en: "Edit content and save. The frontend syncs through the API. Manage banners, products, news, certificates, contact info, SEO, 1688 order URL and inquiries."
  },
  saveSync: { zh: "保存并同步前台", en: "Save & Sync" },
  saved: { zh: "已保存，前台内容已同步。", en: "Saved. Frontend content has been synced." },
  saveFailed: { zh: "保存失败", en: "Save failed" },
  jsonInvalid: { zh: "JSON 暂未通过校验。", en: "JSON is not valid yet." },
  settings: { zh: "基础信息", en: "Settings" },
  banners: { zh: "Banner", en: "Banners" },
  certificates: { zh: "资质", en: "Certificates" },
  news: { zh: "新闻", en: "News" },
  inquiries: { zh: "询盘", en: "Inquiries" },
  loginTitle: { zh: "后台登录", en: "Admin Login" },
  loginIntro: { zh: "请输入管理员账号后维护官网内容。", en: "Sign in to manage website content." },
  username: { zh: "账号", en: "Username" },
  password: { zh: "密码", en: "Password" },
  login: { zh: "登录", en: "Sign In" },
  logout: { zh: "退出登录", en: "Sign Out" },
  uploadImage: { zh: "上传图片", en: "Upload Image" },
  uploading: { zh: "上传中...", en: "Uploading..." },
  companySettings: { zh: "企业基础信息", en: "Company Settings" },
  remove: { zh: "删除", en: "Remove" },
  addBanner: { zh: "新增 Banner", en: "Add Banner" },
  addProduct: { zh: "新增产品", en: "Add Product" },
  addCertificate: { zh: "新增资质", en: "Add Certificate" },
  addNews: { zh: "新增新闻", en: "Add News" },
  noInquiries: { zh: "暂无询盘记录。", en: "No inquiries yet." },
  inquiryFields: {
    id: { zh: "记录 ID", en: "Record ID" },
    createdAt: { zh: "提交时间", en: "Submitted At" },
    status: { zh: "状态", en: "Status" },
    company: { zh: "公司名称", en: "Company" },
    contact: { zh: "联系人", en: "Contact" },
    email: { zh: "手机 / 邮箱", en: "Phone / Email" },
    country: { zh: "国家 / 地区", en: "Country / Region" },
    product: { zh: "意向产品", en: "Interested Product" },
    quantity: { zh: "采购数量", en: "Quantity" },
    oem: { zh: "OEM / ODM", en: "OEM / ODM" },
    message: { zh: "项目说明", en: "Project Details" },
    attachment: { zh: "附件", en: "Attachment" }
  },
  field: {
    brandZh: { zh: "品牌名称（中文）", en: "Brand Name (Chinese)" },
    brandEn: { zh: "品牌名称（英文）", en: "Brand Name (English)" },
    companyZh: { zh: "公司名称（中文）", en: "Company Name (Chinese)" },
    companyEn: { zh: "公司名称（英文）", en: "Company Name (English)" },
    phone: { zh: "联系电话", en: "Phone" },
    email: { zh: "邮箱", en: "Email" },
    whatsapp: { zh: "WhatsApp", en: "WhatsApp" },
    addressZh: { zh: "地址（中文）", en: "Address (Chinese)" },
    addressEn: { zh: "地址（英文）", en: "Address (English)" },
    seoTitleZh: { zh: "SEO 标题（中文）", en: "SEO Title (Chinese)" },
    seoTitleEn: { zh: "SEO 标题（英文）", en: "SEO Title (English)" },
    seoDescriptionZh: { zh: "SEO 描述（中文）", en: "SEO Description (Chinese)" },
    seoDescriptionEn: { zh: "SEO 描述（英文）", en: "SEO Description (English)" },
    imageUrl: { zh: "图片地址", en: "Image URL" },
    kickerZh: { zh: "小标题（中文）", en: "Kicker (Chinese)" },
    kickerEn: { zh: "小标题（英文）", en: "Kicker (English)" },
    titleZh: { zh: "标题（中文）", en: "Title (Chinese)" },
    titleEn: { zh: "标题（英文）", en: "Title (English)" },
    subtitleZh: { zh: "副标题（中文）", en: "Subtitle (Chinese)" },
    subtitleEn: { zh: "副标题（英文）", en: "Subtitle (English)" },
    nameZh: { zh: "名称（中文）", en: "Name (Chinese)" },
    nameEn: { zh: "名称（英文）", en: "Name (English)" },
    category: { zh: "分类 ID", en: "Category ID" },
    summaryZh: { zh: "简介（中文）", en: "Summary (Chinese)" },
    summaryEn: { zh: "简介（英文）", en: "Summary (English)" },
    diameter: { zh: "直径 / 尺寸", en: "Diameter / Size" },
    package: { zh: "包装尺寸", en: "Package Size" },
    weight: { zh: "重量", en: "Weight" },
    color: { zh: "颜色", en: "Color" },
    date: { zh: "日期", en: "Date" },
    bodyZh: { zh: "正文（中文）", en: "Body (Chinese)" },
    bodyEn: { zh: "正文（英文）", en: "Body (English)" }
  }
};

const tx = (key, lang) => t(key.split(".").reduce((acc, part) => acc?.[part], uiText), lang);
const inquiryLabel = (key, lang) => t(uiText.inquiryFields[key], lang) || key;

function App() {
  const [content, setContent] = useState(null);
  const [lang, setLang] = useState("zh");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken") || "");
  const isAdmin = window.location.pathname.startsWith("/admin");

  useEffect(() => {
    const headers = isAdmin && adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
    const url = isAdmin && adminToken ? "/api/admin/content" : "/api/content";
    fetch(url, { headers }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        setAdminToken("");
        return fetch("/api/content");
      }
      return res;
    }).then((res) => res.json()).then(setContent);
  }, [isAdmin, adminToken]);

  useEffect(() => {
    if (!content) return;
    document.title = t(content.seo?.title, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [content, lang]);

  if (!content) return <div className="loading">Loading Angyue...</div>;

  if (isAdmin) {
    return <Admin content={content} setContent={setContent} lang={lang} setLang={setLang} token={adminToken} setToken={setAdminToken} />;
  }

  return (
    <>
      <Header content={content} lang={lang} setLang={setLang} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <Hero content={content} lang={lang} />
        <TechDashboard content={content} lang={lang} />
        <BrandCore content={content} lang={lang} />
        <Stats content={content} lang={lang} />
        <Products content={content} lang={lang} />
        <Manufacturing content={content} lang={lang} />
        <AiAndData content={content} lang={lang} />
        <ResearchAndCertificates content={content} lang={lang} />
        <News content={content} lang={lang} />
        <Inquiry content={content} lang={lang} />
      </main>
      <Footer content={content} lang={lang} />
      <MobileBar content={content} lang={lang} setLang={setLang} />
    </>
  );
}

function Header({ content, lang, setLang, mobileOpen, setMobileOpen }) {
  const nav = [
    ["home", lang === "zh" ? "首页" : "Home"],
    ["brand", lang === "zh" ? "品牌实力" : "Brand"],
    ["products", lang === "zh" ? "产品中心" : "Products"],
    ["manufacturing", lang === "zh" ? "智造实力" : "Manufacturing"],
    ["ai", lang === "zh" ? "AI 智能生产" : "AI"],
    ["research", lang === "zh" ? "研发中心" : "R&D"],
    ["inquiry", lang === "zh" ? "商务洽谈" : "Inquiry"]
  ];
  return (
    <header className="site-header">
      <a className="logo" href="#home" aria-label="Angyue Home">
        <span className="logo-mark">AY</span>
        <span>
          <strong>{t(content.settings.brand, lang)}</strong>
          <small>{t(content.settings.company, lang)}</small>
        </span>
      </a>
      <nav className={mobileOpen ? "nav open" : "nav"}>
        {nav.map(([id, label]) => <a key={id} onClick={() => setMobileOpen(false)} href={`#${id}`}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={() => setLang(lang === "zh" ? "en" : "zh")} title="Language">
          <Globe2 size={18} /> {lang === "zh" ? "EN" : "CN"}
        </button>
        <a className="outline-button shop-button" href={content.settings.shopUrl} target="_blank" rel="noreferrer">
          <ShoppingCart size={18} /> {tx("shopOrder", lang)}
        </a>
        <a className="primary-button" href="#inquiry">{tx("inquiry", lang)}</a>
        <a className="icon-button admin-link" href="/admin" title="Admin"><Settings size={18} /></a>
        <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

function Hero({ content, lang }) {
  const [index, setIndex] = useState(0);
  const banner = content.banners[index] || content.banners[0];
  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % content.banners.length), 5200);
    return () => clearInterval(timer);
  }, [content.banners.length]);
  return (
    <section id="home" className="hero">
      <img src={banner.image} alt={t(banner.title, lang)} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow"><Sparkles size={16} /> {t(banner.kicker, lang)}</span>
        <h1>{t(banner.title, lang)}</h1>
        <p>{t(banner.subtitle, lang)}</p>
        <div className="hero-buttons">
          <a className="primary-button" href="#manufacturing">{lang === "zh" ? "了解智造实力" : "Explore Manufacturing"} <ArrowRight size={18} /></a>
          <a className="light-button" href="#products">{lang === "zh" ? "查看产品中心" : "View Products"}</a>
        </div>
        <ShopUrlPanel url={content.settings.shopUrl} lang={lang} compact />
      </div>
      <div className="hero-console" aria-hidden="true">
        <span>{lang === "zh" ? "AI 智造中控" : "AI Control"}</span>
        <strong>98.7%</strong>
        <small>{lang === "zh" ? "质检稳定率" : "QC stability"}</small>
        <div className="console-bars"><i /><i /><i /><i /></div>
      </div>
      <div className="hero-tabs">
        {content.banners.map((item, i) => (
          <button key={item.id} className={i === index ? "active" : ""} onClick={() => setIndex(i)}>{String(i + 1).padStart(2, "0")}</button>
        ))}
      </div>
    </section>
  );
}

function TechDashboard({ content, lang }) {
  const metrics = [
    { value: "AI", label: { zh: "智能质检", en: "Smart Inspection" } },
    { value: "360°", label: { zh: "安全防护", en: "Safety Protection" } },
    { value: "ODM", label: { zh: "定制开发", en: "Custom Development" } },
    { value: "24h", label: { zh: "询盘响应", en: "Inquiry Response" } }
  ];
  const flow = lang === "zh"
    ? ["需求分析", "结构测算", "样品打样", "批量生产", "智能质检", "交付跟进"]
    : ["Requirement", "Simulation", "Sampling", "Production", "Inspection", "Delivery"];

  return (
    <section className="tech-dashboard">
      <div className="tech-dashboard-inner">
        <div className="tech-copy">
          <span className="eyebrow"><Bot size={16} /> {lang === "zh" ? "AI 智造中控台" : "AI Manufacturing Console"}</span>
          <h2>{lang === "zh" ? "用数据、算法与自动化流程管理每一次交付" : "Data, algorithms and automation manage every delivery"}</h2>
          <p>{lang === "zh" ? "从客户需求、结构测算、打样确认到批量生产，官网以科技化方式呈现工厂的研发、质检和交付能力。" : "From requirements and structural simulation to samples and production, the site presents R&D, inspection and delivery in a technology-led way."}</p>
        </div>
        <div className="metric-console">
          {metrics.map((item) => (
            <article key={item.value}>
              <strong>{item.value}</strong>
              <span>{t(item.label, lang)}</span>
            </article>
          ))}
        </div>
        <div className="console-flow">
          {flow.map((item, index) => (
            <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
          ))}
        </div>
        <ShopUrlPanel url={content.settings.shopUrl} lang={lang} compact />
      </div>
    </section>
  );
}

function SectionTitle({ icon: Icon, kicker, title, body }) {
  return (
    <div className="section-title">
      <span className="eyebrow">{Icon && <Icon size={16} />} {kicker}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function ShopUrlPanel({ url, lang, compact = false }) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={compact ? "shop-url-panel compact" : "shop-url-panel"}>
      <div className="shop-url-text">
        <span>{tx("shopAddress", lang)}</span>
        <strong>{url}</strong>
      </div>
      <div className="shop-url-actions">
        <a className="primary-button" href={url} target="_blank" rel="noreferrer">
          <ExternalLink size={17} /> {tx("open1688", lang)}
        </a>
        <button className="outline-button" type="button" onClick={copyUrl}>
          <Copy size={17} /> {copied ? tx("copied", lang) : tx("copyAddress", lang)}
        </button>
      </div>
    </div>
  );
}

function BrandCore({ content, lang }) {
  return (
    <section id="brand" className="section split-section">
      <div>
        <SectionTitle
          icon={ShieldCheck}
          kicker={lang === "zh" ? "品牌核心定位" : "Brand Positioning"}
          title={lang === "zh" ? "高端品质、智能生产与自主研发一体化" : "Premium quality, smart production and in-house R&D"}
          body={lang === "zh" ? "拒绝低端代工，以可见的工厂实力、稳定的品控体系和持续研发能力支撑长期采购信任。" : "A visible factory, stable quality system and continuous R&D capability build long-term procurement confidence."}
        />
        <div className="value-grid">
          {content.values.map((item) => (
            <article className="value-card" key={t(item.title, "en")}>
              <CheckCircle2 size={20} />
              <h3>{t(item.title, lang)}</h3>
              <p>{t(item.body, lang)}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="image-stack">
        <img src="/assets/1688/shop-hero-03.jpg" alt="Production workshop and factory exterior" />
        <div className="stack-note">
          <Factory />
          <span>{lang === "zh" ? "15,000 平方米现代化工厂，约 180 名员工" : "15,000m² modern factory with about 180 team members"}</span>
        </div>
      </div>
    </section>
  );
}

function Stats({ content, lang }) {
  return (
    <section className="stats-band">
      {content.stats.map((stat) => (
        <div key={t(stat.label, "en")}>
          <strong>{stat.value}</strong>
          <span>{t(stat.label, lang)}</span>
        </div>
      ))}
    </section>
  );
}

function Products({ content, lang }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const products = useMemo(() => {
    return content.products.filter((product) => {
      const categoryOk = category === "all" || product.category === category;
      const queryOk = !query || `${t(product.name, lang)} ${t(product.summary, lang)}`.toLowerCase().includes(query.toLowerCase());
      return categoryOk && queryOk;
    });
  }, [content.products, category, query, lang]);

  return (
    <section id="products" className="section">
      <SectionTitle
        icon={Building2}
        kicker={lang === "zh" ? "产品中心" : "Product Center"}
        title={lang === "zh" ? "蹦床与体育器材产品矩阵" : "Trampoline and sports equipment portfolio"}
        body={lang === "zh" ? "官网负责品牌化展示和信任背书，1688 店铺作为批发成交入口。" : "The website builds trust and brand value, while 1688 supports wholesale transactions."}
      />
      <ShopUrlPanel url={content.settings.shopUrl} lang={lang} />
      <div className="product-tools">
        <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === "zh" ? "搜索产品" : "Search products"} /></div>
        <div className="category-tabs">
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>{lang === "zh" ? "全部" : "All"}</button>
          {content.categories.map((cat) => <button key={cat.id} className={category === cat.id ? "active" : ""} onClick={() => setCategory(cat.id)}>{t(cat.name, lang)}</button>)}
        </div>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img src={product.image} alt={t(product.name, lang)} />
            <div>
              <h3>{t(product.name, lang)}</h3>
              <p>{t(product.summary, lang)}</p>
              <div className="spec-row"><span>{product.specs.diameter}</span><span>{product.specs.color}</span></div>
              <button className="text-button" onClick={() => setSelected(product)}>{lang === "zh" ? "查看详情" : "Details"} <ArrowRight size={16} /></button>
            </div>
          </article>
        ))}
      </div>
      {selected && <ProductModal product={selected} content={content} lang={lang} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProductModal({ product, content, lang, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}><X /></button>
        <img src={product.image} alt={t(product.name, lang)} />
        <div className="modal-body">
          <h2>{t(product.name, lang)}</h2>
          <p>{t(product.summary, lang)}</p>
          <dl className="spec-list">
            {Object.entries(product.specs).map(([key, value]) => <React.Fragment key={key}><dt>{key}</dt><dd>{value}</dd></React.Fragment>)}
          </dl>
          <div className="modal-actions">
            <a className="primary-button" href="#inquiry" onClick={onClose}>{lang === "zh" ? "立即询盘" : "Send Inquiry"}</a>
            <a className="outline-button shop-button" href={content.settings.shopUrl} target="_blank" rel="noreferrer">
              <ShoppingCart size={17} /> {tx("shopOrder", lang)}
            </a>
          </div>
          <ShopUrlPanel url={content.settings.shopUrl} lang={lang} />
        </div>
      </article>
    </div>
  );
}

function Manufacturing({ content, lang }) {
  const stepIcons = [Scissors, Wrench, Hammer, Paintbrush, Boxes, ShieldCheck];
  const stepDetails = lang === "zh"
    ? [
        "数控下料与尺寸校准，保障管材切口平整一致。",
        "自动折弯成型，控制角度误差与结构稳定性。",
        "夹具定位配合焊接工艺，提升连接强度。",
        "表面预处理与喷涂固化，增强防锈耐候能力。",
        "标准化装配工位，减少人工误差与漏装风险。",
        "关键尺寸、承重、外观与包装全流程复核。"
      ]
    : [
        "CNC cutting and dimensional calibration keep tube cuts consistent.",
        "Automated bending controls angle tolerance and structural stability.",
        "Fixture positioning and welding improve connection strength.",
        "Surface treatment and coating curing enhance weather resistance.",
        "Standardized assembly stations reduce manual errors.",
        "Dimensions, load capacity, appearance and packing are checked."
      ];
  const stepMetrics = lang === "zh"
    ? ["精准下料", "角度控制", "强度连接", "耐候防锈", "标准装配", "出厂复核"]
    : ["Precise Cutting", "Angle Control", "Strong Joint", "Anti-rust Finish", "Standard Assembly", "Final Check"];
  const flowItems = lang === "zh"
    ? [
        { label: "原材料入库", icon: Warehouse },
        { label: "自动化加工", icon: Cpu },
        { label: "智能焊接", icon: Hammer },
        { label: "表面处理", icon: Paintbrush },
        { label: "自动组装", icon: Boxes },
        { label: "智能质检", icon: ShieldCheck },
        { label: "成品出库", icon: Truck }
      ]
    : [
        { label: "Materials", icon: Warehouse },
        { label: "Auto Processing", icon: Cpu },
        { label: "Smart Welding", icon: Hammer },
        { label: "Surface Treatment", icon: Paintbrush },
        { label: "Assembly", icon: Boxes },
        { label: "Inspection", icon: ShieldCheck },
        { label: "Shipment", icon: Truck }
      ];

  return (
    <section id="manufacturing" className="section manufacturing">
      <SectionTitle
        icon={Factory}
        kicker={lang === "zh" ? "智造实力" : "Manufacturing Strength"}
        title={lang === "zh" ? "看得见的智造，才是放心的品质" : "Visible manufacturing creates trusted quality"}
      />
      <div className="process-grid">
        {content.manufacturing.map((item, index) => (
          <article className="process-card" key={t(item, "en")}>
            <div className="process-card-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="process-icon">
                {React.createElement(stepIcons[index] || Wrench, { size: 26, strokeWidth: 2.2 })}
              </div>
            </div>
            <h3>{t(item, lang)}</h3>
            <p>{stepDetails[index]}</p>
            <b>{stepMetrics[index]}</b>
            {index < content.manufacturing.length - 1 && <ChevronRight className="process-arrow" size={22} />}
          </article>
        ))}
      </div>
      <div className="flow-line" aria-label={lang === "zh" ? "制造流程" : "Manufacturing flow"}>
        {flowItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <span>
              <item.icon size={18} />
              {item.label}
            </span>
            {index < flowItems.length - 1 && <CircleDot className="flow-dot" size={14} />}
          </React.Fragment>
        ))}
      </div>
      <div className="quality-loop">
        <PackageCheck size={22} />
        <div>
          <strong>{lang === "zh" ? "全流程可追溯品控闭环" : "Traceable Quality Loop"}</strong>
          <p>{lang === "zh" ? "每个关键工序形成记录，配合抽检、复检和出厂确认，让采购客户看到真实制造过程。" : "Each key process keeps records with sampling, re-inspection and final confirmation for transparent manufacturing."}</p>
        </div>
      </div>
    </section>
  );
}

function AiAndData({ content, lang }) {
  const dataItems = lang === "zh"
    ? ["产品使用数据", "器材损耗数据", "客户反馈数据", "场景使用数据", "售后问题分析", "产品结构优化"]
    : ["Usage Data", "Wear Data", "Customer Feedback", "Scenario Data", "After-sales Analysis", "Structure Optimization"];
  return (
    <section id="ai" className="section two-panels">
      <article>
        <SectionTitle icon={Bot} kicker={lang === "zh" ? "AI 智能生产" : "AI Production"} title={lang === "zh" ? "AI 赋能研发、检测与质控" : "AI supports R&D, inspection and quality control"} />
        <div className="chip-list">{content.ai.map((item) => <span key={t(item, "en")}>{t(item, lang)}</span>)}</div>
      </article>
      <article>
        <SectionTitle icon={BarChart3} kicker={lang === "zh" ? "大数据中心" : "Data Center"} title={lang === "zh" ? "用真实场景反馈驱动产品迭代" : "Real scenario feedback drives product iteration"} />
        <div className="chip-list">{dataItems.map((item) => <span key={item}>{item}</span>)}</div>
      </article>
    </section>
  );
}

function ResearchAndCertificates({ content, lang }) {
  return (
    <section id="research" className="section split-section reverse">
      <div className="image-stack">
        <img src="/assets/catalog-page-01.png" alt="Certificates and honors" />
        <div className="stack-note"><Award /><span>{lang === "zh" ? "检测、专利与认证共同支撑采购信任" : "Tests, patents and certificates support buyer trust"}</span></div>
      </div>
      <div>
        <SectionTitle
          icon={Wrench}
          kicker={lang === "zh" ? "研发中心与资质荣誉" : "R&D and Certifications"}
          title={lang === "zh" ? "自主开模、结构优化与 OEM/ODM 定制" : "Tooling, structure optimization and OEM/ODM customization"}
          body={lang === "zh" ? "研发团队围绕安全、耐用、体验和场景适配持续改进产品，满足品牌客户和工程订单需求。" : "The R&D team improves safety, durability, experience and scenario fit for brand buyers and project orders."}
        />
        <div className="certificate-grid">
          {content.certificates.map((cert) => <article key={t(cert.title, "en")}><ShieldCheck /><span>{t(cert.title, lang)}</span></article>)}
        </div>
      </div>
    </section>
  );
}

function News({ content, lang }) {
  return (
    <section className="section news-section">
      <SectionTitle icon={MessageSquareText} kicker={lang === "zh" ? "新闻报道" : "News"} title={lang === "zh" ? "企业动态与行业报道" : "Company and industry updates"} />
      <div className="news-grid">
        {content.news.map((item) => <article key={item.id}><time>{item.date}</time><h3>{t(item.title, lang)}</h3><p>{t(item.body, lang)}</p></article>)}
      </div>
    </section>
  );
}

function Inquiry({ content, lang }) {
  const [status, setStatus] = useState("");
  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/inquiries", { method: "POST", body: form });
    if (res.ok) {
      e.currentTarget.reset();
      setStatus(lang === "zh" ? "提交成功，业务人员会尽快联系您。" : "Submitted successfully. Our sales team will contact you soon.");
    }
  }
  return (
    <section id="inquiry" className="section inquiry-section">
      <div>
        <SectionTitle
          icon={Mail}
          kicker={lang === "zh" ? "商务洽谈" : "Business Inquiry"}
          title={lang === "zh" ? "为全球品牌、连锁客户与工程项目提供制造服务" : "Manufacturing service for global brands, chains and projects"}
          body={lang === "zh" ? "提交采购或定制需求，也可直接跳转 1688 店铺了解批发产品。" : "Submit procurement or customization requirements, or visit the 1688 store for wholesale products."}
        />
        <div className="contact-card">
          <a href={`tel:${content.settings.phone}`}><Phone /> {content.settings.phone}</a>
          <a href={`mailto:${content.settings.email}`}><Mail /> {content.settings.email}</a>
          <a href={content.settings.shopUrl} target="_blank" rel="noreferrer"><ShoppingCart /> {tx("shopOrder", lang)}</a>
        </div>
        <ShopUrlPanel url={content.settings.shopUrl} lang={lang} compact />
      </div>
      <form className="inquiry-form" onSubmit={submit}>
        <input name="company" required placeholder={lang === "zh" ? "公司名称" : "Company"} />
        <input name="contact" required placeholder={lang === "zh" ? "联系人" : "Contact person"} />
        <input name="email" required placeholder={lang === "zh" ? "手机 / 邮箱" : "Phone / Email"} />
        <input name="country" placeholder={lang === "zh" ? "国家 / 地区" : "Country / Region"} />
        <input name="product" placeholder={lang === "zh" ? "意向产品" : "Interested product"} />
        <input name="quantity" placeholder={lang === "zh" ? "采购数量" : "Quantity"} />
        <select name="oem">
          <option>{lang === "zh" ? "是否需要 OEM / ODM" : "OEM / ODM needed?"}</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <textarea name="message" rows="4" placeholder={lang === "zh" ? "项目说明" : "Project details"} />
        <input name="attachment" type="file" />
        <button className="primary-button" type="submit">{lang === "zh" ? "提交需求" : "Submit Inquiry"}</button>
        {status && <p className="success-text">{status}</p>}
      </form>
    </section>
  );
}

function Footer({ content, lang }) {
  return (
    <footer className="footer">
      <strong>{t(content.settings.company, lang)}</strong>
      <span>{t(content.settings.address, lang)}</span>
      <span>{content.settings.phone} · {content.settings.email}</span>
    </footer>
  );
}

function MobileBar({ content, lang, setLang }) {
  return (
    <div className="mobile-bar">
      <a href={`tel:${content.settings.phone}`}><Phone size={18} />{tx("call", lang)}</a>
      <a href="#products"><Building2 size={18} />{tx("products", lang)}</a>
      <a href={content.settings.shopUrl} target="_blank" rel="noreferrer"><ShoppingCart size={18} />{tx("shopOrder", lang)}</a>
      <button onClick={() => setLang(lang === "zh" ? "en" : "zh")}><Globe2 size={18} />{tx("language", lang)}</button>
    </div>
  );
}

function Admin({ content, setContent, lang, setLang, token, setToken }) {
  const [draft, setDraft] = useState(content);
  const [rawJson, setRawJson] = useState(JSON.stringify(content, null, 2));
  const [tab, setTab] = useState("settings");
  const [message, setMessage] = useState("");
  const tabs = [
    ["settings", tx("settings", lang)],
    ["banners", tx("banners", lang)],
    ["products", tx("products", lang)],
    ["certificates", tx("certificates", lang)],
    ["news", tx("news", lang)],
    ["inquiries", tx("inquiries", lang)],
    ["json", "JSON"]
  ];

  useEffect(() => {
    setDraft(content);
    setRawJson(JSON.stringify(content, null, 2));
  }, [content]);

  function update(path, value) {
    setDraft((current) => {
      const next = structuredClone(current);
      let target = next;
      path.slice(0, -1).forEach((key) => { target = target[key]; });
      target[path[path.length - 1]] = value;
      setRawJson(JSON.stringify(next, null, 2));
      return next;
    });
  }

  function updateArrayItem(collection, index, path, value) {
    setDraft((current) => {
      const next = structuredClone(current);
      let target = next[collection][index];
      path.slice(0, -1).forEach((key) => { target = target[key]; });
      target[path[path.length - 1]] = value;
      setRawJson(JSON.stringify(next, null, 2));
      return next;
    });
  }

  function addItem(collection, item) {
    const next = { ...draft, [collection]: [item, ...(draft[collection] || [])] };
    setDraft(next);
    setRawJson(JSON.stringify(next, null, 2));
  }

  function removeItem(collection, id) {
    const next = { ...draft, [collection]: draft[collection].filter((item) => item.id !== id && item.title?.en !== id) };
    setDraft(next);
    setRawJson(JSON.stringify(next, null, 2));
  }

  function syncJson(value) {
    setRawJson(value);
    try {
      setDraft(JSON.parse(value));
      setMessage("");
    } catch {
      setMessage(tx("jsonInvalid", lang));
    }
  }

  async function save() {
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft)
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setContent(data.content);
      setDraft(data.content);
      setRawJson(JSON.stringify(data.content, null, 2));
      setMessage(tx("saved", lang));
    } catch (error) {
      setMessage(`${tx("saveFailed", lang)}: ${error.message}`);
    }
  }

  async function logout() {
    if (token) {
      await fetch("/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
    localStorage.removeItem("adminToken");
    setToken("");
  }

  if (!token) {
    return <AdminLogin lang={lang} setLang={setLang} setToken={setToken} />;
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <a className="logo" href="/">
          <span className="logo-mark">AY</span>
          <span><strong>{tx("cmsAdmin", lang)}</strong><small>{tx("contentManagement", lang)}</small></span>
        </a>
        <button className="icon-button" onClick={() => setLang(lang === "zh" ? "en" : "zh")}><Globe2 size={18} /> {tx("language", lang)}</button>
        <a className="outline-button" href="/">{tx("viewSite", lang)}</a>
        <button className="outline-button" onClick={logout}>{tx("logout", lang)}</button>
        <div className="admin-tabs">
          {tabs.map(([key, label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}
        </div>
      </aside>
      <section className="admin-editor">
        <div className="admin-head">
          <div>
            <span className="eyebrow">{tx("backendCms", lang)}</span>
            <h1>{tx("adminTitle", lang)}</h1>
            <p>{tx("adminIntro", lang)}</p>
          </div>
          <button className="primary-button" onClick={save}>{tx("saveSync", lang)}</button>
        </div>
        {tab === "settings" && <AdminSettings draft={draft} update={update} lang={lang} />}
        {tab === "banners" && <AdminBanners draft={draft} updateArrayItem={updateArrayItem} addItem={addItem} removeItem={removeItem} lang={lang} token={token} />}
        {tab === "products" && <AdminProducts draft={draft} updateArrayItem={updateArrayItem} addItem={addItem} removeItem={removeItem} lang={lang} token={token} />}
        {tab === "certificates" && <AdminCertificates draft={draft} updateArrayItem={updateArrayItem} addItem={addItem} removeItem={removeItem} lang={lang} token={token} />}
        {tab === "news" && <AdminNews draft={draft} updateArrayItem={updateArrayItem} addItem={addItem} removeItem={removeItem} lang={lang} />}
        {tab === "inquiries" && <AdminInquiries draft={draft} lang={lang} />}
        {tab === "json" && <textarea className="json-editor" value={rawJson} onChange={(e) => syncJson(e.target.value)} spellCheck="false" />}
        {message && <p className="success-text">{message}</p>}
      </section>
    </main>
  );
}

function AdminLogin({ lang, setLang, setToken }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data.error || "Login failed");
      return;
    }
    localStorage.setItem("adminToken", data.token);
    setToken(data.token);
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="logo-mark">AY</span>
        <span className="eyebrow">{tx("backendCms", lang)}</span>
        <h1>{tx("loginTitle", lang)}</h1>
        <p>{tx("loginIntro", lang)}</p>
        <Field label={tx("username", lang)} value={username} onChange={setUsername} />
        <Field label={tx("password", lang)} value={password} onChange={setPassword} type="password" />
        <button className="primary-button" type="submit">{tx("login", lang)}</button>
        <button className="outline-button" type="button" onClick={() => setLang(lang === "zh" ? "en" : "zh")}><Globe2 size={18} /> {tx("language", lang)}</button>
        {message && <p className="error-text">{message}</p>}
      </form>
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return <label className="field"><span>{label}</span><input type={type} value={value || ""} onChange={(e) => onChange(type === "checkbox" ? e.target.checked : e.target.value)} checked={type === "checkbox" ? Boolean(value) : undefined} /></label>;
}

function ImageUploadField({ label, value, onChange, token, lang }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("image", file);
    try {
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.file.path);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="field image-upload-field">
      <span>{label}</span>
      <div className="image-upload-row">
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
        <label className="upload-button">
          {uploading ? tx("uploading", lang) : tx("uploadImage", lang)}
          <input type="file" accept="image/*" onChange={uploadImage} />
        </label>
      </div>
      {value && <img className="image-preview" src={value} alt="" />}
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}

function TextAreaField({ label, value, onChange }) {
  return <label className="field wide"><span>{label}</span><textarea rows="3" value={value || ""} onChange={(e) => onChange(e.target.value)} /></label>;
}

function AdminCard({ title, children, onRemove, lang = "zh" }) {
  return <article className="admin-card"><div className="admin-card-head"><h3>{title}</h3>{onRemove && <button className="danger-button" onClick={onRemove}>{tx("remove", lang)}</button>}</div><div className="admin-form-grid">{children}</div></article>;
}

function AdminSettings({ draft, update, lang }) {
  return (
    <div className="admin-stack">
      <AdminCard title={tx("companySettings", lang)} lang={lang}>
        <Field label={tx("field.brandZh", lang)} value={draft.settings.brand.zh} onChange={(v) => update(["settings", "brand", "zh"], v)} />
        <Field label={tx("field.brandEn", lang)} value={draft.settings.brand.en} onChange={(v) => update(["settings", "brand", "en"], v)} />
        <Field label={tx("field.companyZh", lang)} value={draft.settings.company.zh} onChange={(v) => update(["settings", "company", "zh"], v)} />
        <Field label={tx("field.companyEn", lang)} value={draft.settings.company.en} onChange={(v) => update(["settings", "company", "en"], v)} />
        <Field label={tx("field.phone", lang)} value={draft.settings.phone} onChange={(v) => update(["settings", "phone"], v)} />
        <Field label={tx("field.email", lang)} value={draft.settings.email} onChange={(v) => update(["settings", "email"], v)} />
        <Field label={tx("field.whatsapp", lang)} value={draft.settings.whatsapp} onChange={(v) => update(["settings", "whatsapp"], v)} />
        <Field label={tx("shopAddress", lang)} value={draft.settings.shopUrl} onChange={(v) => update(["settings", "shopUrl"], v)} />
        <TextAreaField label={tx("field.addressZh", lang)} value={draft.settings.address.zh} onChange={(v) => update(["settings", "address", "zh"], v)} />
        <TextAreaField label={tx("field.addressEn", lang)} value={draft.settings.address.en} onChange={(v) => update(["settings", "address", "en"], v)} />
      </AdminCard>
      <AdminCard title="SEO" lang={lang}>
        <Field label={tx("field.seoTitleZh", lang)} value={draft.seo.title.zh} onChange={(v) => update(["seo", "title", "zh"], v)} />
        <Field label={tx("field.seoTitleEn", lang)} value={draft.seo.title.en} onChange={(v) => update(["seo", "title", "en"], v)} />
        <TextAreaField label={tx("field.seoDescriptionZh", lang)} value={draft.seo.description.zh} onChange={(v) => update(["seo", "description", "zh"], v)} />
        <TextAreaField label={tx("field.seoDescriptionEn", lang)} value={draft.seo.description.en} onChange={(v) => update(["seo", "description", "en"], v)} />
      </AdminCard>
    </div>
  );
}

function AdminBanners({ draft, updateArrayItem, addItem, removeItem, lang, token }) {
  return (
    <div className="admin-stack">
      <button className="outline-button" onClick={() => addItem("banners", { id: `b-${Date.now()}`, image: "/assets/catalog-page-02.png", kicker: { zh: "新 Banner", en: "New Banner" }, title: { zh: "标题", en: "Title" }, subtitle: { zh: "副标题", en: "Subtitle" } })}>{tx("addBanner", lang)}</button>
      {draft.banners.map((item, index) => (
        <AdminCard key={item.id} title={item.id} onRemove={() => removeItem("banners", item.id)} lang={lang}>
          <ImageUploadField label={tx("field.imageUrl", lang)} value={item.image} onChange={(v) => updateArrayItem("banners", index, ["image"], v)} token={token} lang={lang} />
          <Field label={tx("field.kickerZh", lang)} value={item.kicker.zh} onChange={(v) => updateArrayItem("banners", index, ["kicker", "zh"], v)} />
          <Field label={tx("field.kickerEn", lang)} value={item.kicker.en} onChange={(v) => updateArrayItem("banners", index, ["kicker", "en"], v)} />
          <Field label={tx("field.titleZh", lang)} value={item.title.zh} onChange={(v) => updateArrayItem("banners", index, ["title", "zh"], v)} />
          <Field label={tx("field.titleEn", lang)} value={item.title.en} onChange={(v) => updateArrayItem("banners", index, ["title", "en"], v)} />
          <TextAreaField label={tx("field.subtitleZh", lang)} value={item.subtitle.zh} onChange={(v) => updateArrayItem("banners", index, ["subtitle", "zh"], v)} />
          <TextAreaField label={tx("field.subtitleEn", lang)} value={item.subtitle.en} onChange={(v) => updateArrayItem("banners", index, ["subtitle", "en"], v)} />
        </AdminCard>
      ))}
    </div>
  );
}

function AdminProducts({ draft, updateArrayItem, addItem, removeItem, lang, token }) {
  return (
    <div className="admin-stack">
      <button className="outline-button" onClick={() => addItem("products", { id: `p-${Date.now()}`, category: "kids", featured: true, image: "/assets/catalog-page-03.png", name: { zh: "新产品", en: "New Product" }, summary: { zh: "产品简介", en: "Product summary" }, specs: { diameter: "", package: "", weight: "", color: "" } })}>{tx("addProduct", lang)}</button>
      {draft.products.map((item, index) => (
        <AdminCard key={item.id} title={item.id} onRemove={() => removeItem("products", item.id)} lang={lang}>
          <Field label={tx("field.nameZh", lang)} value={item.name.zh} onChange={(v) => updateArrayItem("products", index, ["name", "zh"], v)} />
          <Field label={tx("field.nameEn", lang)} value={item.name.en} onChange={(v) => updateArrayItem("products", index, ["name", "en"], v)} />
          <Field label={tx("field.category", lang)} value={item.category} onChange={(v) => updateArrayItem("products", index, ["category"], v)} />
          <ImageUploadField label={tx("field.imageUrl", lang)} value={item.image} onChange={(v) => updateArrayItem("products", index, ["image"], v)} token={token} lang={lang} />
          <TextAreaField label={tx("field.summaryZh", lang)} value={item.summary.zh} onChange={(v) => updateArrayItem("products", index, ["summary", "zh"], v)} />
          <TextAreaField label={tx("field.summaryEn", lang)} value={item.summary.en} onChange={(v) => updateArrayItem("products", index, ["summary", "en"], v)} />
          <Field label={tx("field.diameter", lang)} value={item.specs.diameter} onChange={(v) => updateArrayItem("products", index, ["specs", "diameter"], v)} />
          <Field label={tx("field.package", lang)} value={item.specs.package} onChange={(v) => updateArrayItem("products", index, ["specs", "package"], v)} />
          <Field label={tx("field.weight", lang)} value={item.specs.weight} onChange={(v) => updateArrayItem("products", index, ["specs", "weight"], v)} />
          <Field label={tx("field.color", lang)} value={item.specs.color} onChange={(v) => updateArrayItem("products", index, ["specs", "color"], v)} />
        </AdminCard>
      ))}
    </div>
  );
}

function AdminCertificates({ draft, updateArrayItem, addItem, removeItem, lang, token }) {
  return (
    <div className="admin-stack">
      <button className="outline-button" onClick={() => addItem("certificates", { title: { zh: "新资质", en: "New Certificate" }, image: "/assets/catalog-page-01.png" })}>{tx("addCertificate", lang)}</button>
      {draft.certificates.map((item, index) => (
        <AdminCard key={`${item.title.en}-${index}`} title={item.title.en} onRemove={() => removeItem("certificates", item.title.en)} lang={lang}>
          <Field label={tx("field.titleZh", lang)} value={item.title.zh} onChange={(v) => updateArrayItem("certificates", index, ["title", "zh"], v)} />
          <Field label={tx("field.titleEn", lang)} value={item.title.en} onChange={(v) => updateArrayItem("certificates", index, ["title", "en"], v)} />
          <ImageUploadField label={tx("field.imageUrl", lang)} value={item.image} onChange={(v) => updateArrayItem("certificates", index, ["image"], v)} token={token} lang={lang} />
        </AdminCard>
      ))}
    </div>
  );
}

function AdminNews({ draft, updateArrayItem, addItem, removeItem, lang }) {
  return (
    <div className="admin-stack">
      <button className="outline-button" onClick={() => addItem("news", { id: `n-${Date.now()}`, date: new Date().toISOString().slice(0, 10), title: { zh: "新闻标题", en: "News Title" }, body: { zh: "新闻正文", en: "News body" } })}>{tx("addNews", lang)}</button>
      {draft.news.map((item, index) => (
        <AdminCard key={item.id} title={item.id} onRemove={() => removeItem("news", item.id)} lang={lang}>
          <Field label={tx("field.date", lang)} value={item.date} onChange={(v) => updateArrayItem("news", index, ["date"], v)} />
          <Field label={tx("field.titleZh", lang)} value={item.title.zh} onChange={(v) => updateArrayItem("news", index, ["title", "zh"], v)} />
          <Field label={tx("field.titleEn", lang)} value={item.title.en} onChange={(v) => updateArrayItem("news", index, ["title", "en"], v)} />
          <TextAreaField label={tx("field.bodyZh", lang)} value={item.body.zh} onChange={(v) => updateArrayItem("news", index, ["body", "zh"], v)} />
          <TextAreaField label={tx("field.bodyEn", lang)} value={item.body.en} onChange={(v) => updateArrayItem("news", index, ["body", "en"], v)} />
        </AdminCard>
      ))}
    </div>
  );
}

function AdminInquiries({ draft, lang }) {
  return (
    <div className="admin-stack">
      {(draft.inquiries || []).length === 0 && <div className="empty-state">{tx("noInquiries", lang)}</div>}
      {(draft.inquiries || []).map((item) => (
        <AdminCard key={item.id} title={`${item.company || tx("inquiries", lang)} · ${item.createdAt}`} lang={lang}>
          {Object.entries(item).map(([key, value]) => <Field key={key} label={inquiryLabel(key, lang)} value={typeof value === "object" ? JSON.stringify(value) : value} onChange={() => {}} />)}
        </AdminCard>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
