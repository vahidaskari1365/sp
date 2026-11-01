import { Client } from "pg";
import { config } from "dotenv";

config();

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL missing");

const img = (id, ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1400`;

const categories = [
  {
    slug: "outerwear",
    name: "پالتو و کت",
    tagline: "لایه‌های گرم، خط‌های ساده",
    image: img(5652359),
    sortOrder: 1,
  },
  {
    slug: "dresses",
    name: "پیراهن و شومیز",
    tagline: "ابریشم، کتان، حرکت",
    image: img(20620137),
    sortOrder: 2,
  },
  {
    slug: "knitwear",
    name: "بافت و تی‌شرت",
    tagline: "پشم مرینوس و پنبهٔ ارگانیک",
    image: img(8667730),
    sortOrder: 3,
  },
  {
    slug: "pants",
    name: "شلوار و کتان",
    tagline: "فرم راسته، دوخت تمیز",
    image: img(12456331),
    sortOrder: 4,
  },
  {
    slug: "sets",
    name: "ست و کالکشن",
    tagline: "هماهنگی از سر تا پا",
    image: img(18900111),
    sortOrder: 5,
  },
];

const BLACK = ["مشکی", "#14100c"];
const CREAM = ["کرم", "#e6d9c3"];
const BROWN = ["شکلاتی", "#4a3423"];
const OLIVE = ["زیتونی", "#5c6149"];
const NAVY = ["سرمه‌ای", "#283a4f"];
const KHAKI = ["خاکی", "#a98c6b"];
const GREY = ["طوسی", "#8b8b85"];
const BLUSH = ["صورتی خاکی", "#d8ada1"];
const WHITE = ["سفید", "#f2eee7"];
const BURGUNDY = ["شرابی", "#6b2432"];
const SAFFRON = ["زعفرانی", "#c98f2d"];
const CHAMPAGNE = ["شامپاینی", "#d9c39a"];
const INDIGO = ["نیلی", "#3b4a6b"];

const products = [
  {
    slug: "shabboo-wool-coat",
    name: "پالتو پشمی شب‌بو",
    subtitle: "رنگ شرابی عمیق، یقهٔ انگلیسی",
    description:
      "پالتو شب‌بو با پشم مرینوس در رنگ شرابی عمیق دوخته می‌شود؛ رنگی که از نقش‌های ترمهٔ سنتی الهام گرفته است. یقهٔ انگلیسی پهن و برش ماس‌کوت آن روی لایه‌های بافت به‌خوبی می‌نشیند و برای پاییز و زمستان طراحی شده است. جیب‌های مخفی کنار درز و دکمه‌های صدفی، جزئیاتی هستند که در نگاه دوم کشف می‌شوند.",
    story:
      "رنگ شرابی این پالتو از الگوی ترمهٔ یزد گرفته شده و در کارگاه رنگرزی با روش تثبیت دو‌مرحله‌ای رنگ می‌شود.",
    fabric: "۸۰٪ پشم مرینوس، ۲۰٪ کشمیر — آستر ۱۰۰٪ ویسکوز",
    care: "خشک‌شویی توصیه می‌شود. اتوی بخار ملایم از پشت پارچه.",
    price: 5150000,
    compareAtPrice: 6400000,
    category: "outerwear",
    isFeatured: true,
    badge: "جدید",
    rating: 49,
    reviewCount: 47,
    images: [img(291762), img(19271547), img(5652359)],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [BURGUNDY, BLACK, CREAM],
  },
  {
    slug: "shabnam-velvet-dress",
    name: "پیراهن مخمل شب شبنم",
    subtitle: "مخمل کوبلنی، دامن کلوش",
    description:
      "پیراهن شبنم از مخمل کوبلنی سبک با آستر ساتن دوخته می‌شود؛ بالاتنهٔ دریده و دامن کلوش آن در هر حرکت موج برمی‌دارد. برای شب‌های سرد و مهمانی‌های رسمی، همراه ایده‌آل یک شال ابریشمی است.",
    story: "مخمل این پیراهن در تیراژ محدود بافته می‌شود؛ از هر رنگ تنها ۶۰ قطعه دوخته می‌شود.",
    fabric: "۹۲٪ مخمل کوبلنی، ۸٪ الاستان — آستر ساتن",
    care: "خشک‌شویی. اتوی بخار سرد از پشت پارچه.",
    price: 3280000,
    compareAtPrice: 3950000,
    category: "dresses",
    isFeatured: true,
    badge: "مجلسی",
    rating: 50,
    reviewCount: 62,
    images: [img(972995), img(985635)],
    sizes: ["XS", "S", "M", "L"],
    colors: [BURGUNDY, NAVY],
  },
  {
    slug: "roshank-satin-blouse",
    name: "بلوز ساتن روشنک",
    subtitle: "ساتن مات، مچ کشی",
    description:
      "بلوز روشنک از ساتن مات با افت طبیعی پارچه دوخته شده است؛ مچ کشی و فرم کمی آزاد آن را هم با شلوار رسمی و هم با جین هماهنگ می‌کند. درخشش ملایم ساتن در نور روز مات و در نور شب گرم دیده می‌شود.",
    story: "الگوی این بلوز از بلوزهای دههٔ ۴۰ الهام گرفته و در سه رنگ مات تولید می‌شود.",
    fabric: "۹۵٪ ویسکوز ساتن، ۵٪ الاستان",
    care: "شست‌وشوی دستی با آب سرد یا کیسهٔ لباسشویی در برنامهٔ ملایم.",
    price: 1850000,
    compareAtPrice: 2300000,
    category: "dresses",
    isFeatured: true,
    badge: null,
    rating: 47,
    reviewCount: 38,
    images: [img(1926769), img(1021693)],
    sizes: ["S", "M", "L", "XL"],
    colors: [CHAMPAGNE, CREAM, BLACK],
  },
  {
    slug: "golnar-knit-dress",
    name: "پیراهن بافت گلنار",
    subtitle: "بافت درشت مرینوس، فرم آزاد",
    description:
      "پیراهن بافت گلنار با نخ نیمه‌ضخیم مرینوس و بافت درشت بافته می‌شود؛ گرم، سبک و بدون خارش. فرم آزاد و قد روی زانو آن را برای روزهای کاری و تعطیلات آخر هفته مناسب می‌کند.",
    story: "رنگ زعفرانی این بافت در دسته‌های کوچک رنگ می‌شود تا ناهمگونی طبیعی نخ حفظ شود.",
    fabric: "۱۰۰٪ پشم مرینوس اکسترافاین",
    care: "شست‌وشوی دستی با شامپوی پشم، خشک کردن افقی.",
    price: 2450000,
    compareAtPrice: null,
    category: "knitwear",
    isFeatured: false,
    badge: "پیشنهاد ترمه",
    rating: 48,
    reviewCount: 57,
    images: [img(1055691), img(8667730)],
    sizes: ["S", "M", "L"],
    colors: [SAFFRON, CREAM, OLIVE],
  },
  {
    slug: "mahoor-striped-shirt",
    name: "شومیز راه‌راه ماهور",
    subtitle: "نخی پنبه‌ای، راه‌راه سرمه‌ای",
    description:
      "شومیز ماهور از پنبهٔ پنبه‌ای راه‌راه با یقهٔ کلاسیک و آستین کمی گشاد دوخته می‌شود؛ انتخابی همیشه‌به‌روز برای فصل‌های گرم که با هر رنگ شلوار هماهنگ می‌شود.",
    story: "پارچهٔ راه‌راه این شومیز از یک کارگاه نساجی کوچک در یزد تأمین می‌شود.",
    fabric: "۱۰۰٪ پنبهٔ پنبه‌ای",
    care: "ماشین لباسشویی ۳۰ درجه، اتوی متوسط.",
    price: 1590000,
    compareAtPrice: 1980000,
    category: "dresses",
    isFeatured: false,
    badge: null,
    rating: 46,
    reviewCount: 25,
    images: [img(1462637), img(994523)],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [WHITE, NAVY],
  },
  {
    slug: "bardia-slim-jeans",
    name: "شلوار جین اسلیم بردیا",
    subtitle: "جین کشی، کمر متوسط",
    description:
      "جین بردیا با الیاف کشی کمی آزادتر از اسلیم کلاسیک دوخته می‌شود؛ برای روزهای بلند کاری که راحتی به‌اندازهٔ ظاهر مهم است. جین ۱۲ اونس با رنگ‌ثابت و دوخت تقویتی روی درزها تولید می‌شود.",
    story: "الگوی بردیا پس از ۴ نمونهٔ آزمایشی روی قدهای ۱۶۵ تا ۱۹۰ سانتی‌متر نهایی شد.",
    fabric: "۹۸٪ پنبه، ۲٪ الاستان",
    care: "شست‌وشوی سرد و پشت‌ورو؛ خشک کردن در سایه.",
    price: 1990000,
    compareAtPrice: 2450000,
    category: "pants",
    isFeatured: true,
    badge: "پرفروش",
    rating: 47,
    reviewCount: 73,
    images: [img(2129970), img(4614235), img(4614224)],
    sizes: ["30", "32", "34", "36", "38"],
    colors: [INDIGO, BLACK],
  },
  {
    slug: "mehr-wool-coat",
    name: "پالتو پشمی مِهر",
    subtitle: "پشم مرینوس ایتالیایی، دوخت بلند",
    description:
      "پالتو مِهر با پارچهٔ پشم مرینوس و آستر ابریشمی، برای روزهای سرد شهری طراحی شده است. برش بلند و یقهٔ انگلیسی آن، سیلوئتی ایستاده و آرام می‌سازد. دکمه‌های صدفی و جیب‌های مورب، جزئیاتی هستند که در نگاه اول دیده نمی‌شوند اما در استفادهٔ روزانه حس می‌شوند.",
    story:
      "پارچهٔ این پالتو از یک کارگاه نساجی خانوادگی در بیلا تهیه می‌شود؛ همان‌جا که پشم مرینوس با نسبت ۷۰/۳۰ با کشمیر ترکیب می‌شود.",
    fabric: "۷۰٪ پشم مرینوس، ۳۰٪ کشمیر — آستر ۱۰۰٪ ویسکوز",
    care: "شست‌وشوی خشک توصیه می‌شود. از خشک‌کن استفاده نکنید.",
    price: 4850000,
    compareAtPrice: 6200000,
    category: "outerwear",
    isFeatured: true,
    badge: "پرفروش",
    rating: 49,
    reviewCount: 126,
    images: [img(19271547), img(5652359), img(7788788)],
    sizes: ["S", "M", "L", "XL"],
    colors: [CREAM, BROWN, BLACK],
  },
  {
    slug: "termeh-trench-coat",
    name: "ترنچ کتان تِرمه",
    subtitle: "کتان ضدآب، کمربند پارچه‌ای",
    description:
      "ترنچ تِرمه از کتان گاباردین با پوشش ضدآب ساخته شده و برای هوای بهار و پاییز ایده‌آل است. کمربند پارچه‌ای، یقهٔ برگردان و چاک پشت، آزادی حرکت را حفظ می‌کند.",
    story: "الگوی این ترنچ از کت‌های مسافرتی دههٔ 70 بازطراحی شده است.",
    fabric: "۱۰۰٪ کتان گاباردین با پوشش ضدآب",
    care: "شست‌وشوی ملایم با آب سرد، اتوی گرم.",
    price: 3690000,
    compareAtPrice: 4400000,
    category: "outerwear",
    isFeatured: true,
    badge: "جدید",
    rating: 48,
    reviewCount: 84,
    images: [img(5119187), img(18900111), img(7760026)],
    sizes: ["XS", "S", "M", "L"],
    colors: [KHAKI, BLACK, OLIVE],
  },
  {
    slug: "sedra-blazer",
    name: "کت تک‌دکمه سِدرا",
    subtitle: "فرم ساختارمند، یقهٔ تیز",
    description:
      "کت سِدرا با لایه‌گذاری ظریف روی شانه، ساختاری تمیز و مدرن دارد. یک دکمه، جیب‌های دوخته و آستر ساتن، آن را برای محیط کار و مهمانی مناسب می‌کند.",
    story: "دوخت این کت در کارگاه تهران، در ۱۴ مرحلهٔ اتو و فرم‌دهی انجام می‌شود.",
    fabric: "۶۵٪ پشم، ۳۲٪ پلی‌استر، ۳٪ الاستان",
    care: "خشک‌شویی.",
    price: 2980000,
    compareAtPrice: 3600000,
    category: "outerwear",
    isFeatured: true,
    badge: null,
    rating: 47,
    reviewCount: 53,
    images: [img(9463884), img(8484013)],
    sizes: ["S", "M", "L"],
    colors: [CREAM, GREY],
  },
  {
    slug: "orom-wool-coat",
    name: "پالتو کتان اُرم",
    subtitle: "کالکشن مردانه، مناسب روزهای کاری",
    description:
      "پالتوی اُرم با فرم راسته و یقهٔ نیمه‌باز، برای استایل روزمرهٔ مردانه طراحی شده. پارچهٔ کتان-پشم، هم گرم است و هم سنگین نیست.",
    story: "اُرم نام محله‌ای در تهران است که اولین آتلیهٔ ما در آن شکل گرفت.",
    fabric: "۵۵٪ کتان، ۴۵٪ پشم",
    care: "خشک‌شویی یا شست‌وشوی دستی با آب سرد.",
    price: 4250000,
    compareAtPrice: 5100000,
    category: "outerwear",
    isFeatured: false,
    badge: "پیشنهاد ترمه",
    rating: 48,
    reviewCount: 61,
    images: [img(13885989), img(3019349), img(16453876)],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [KHAKI, NAVY],
  },
  {
    slug: "nila-silk-dress",
    name: "پیراهن ابریشمی نیلا",
    subtitle: "ابریشم شسته، برش مورب",
    description:
      "پیراهن نیلا با برش مورب، روی بدن می‌نشیند و حرکت می‌کند. ابریشم شسته، درخششی مات و طبیعی دارد؛ مناسب مهمانی‌های شب و روزهای خاص.",
    story: "الگوی مورب این پیراهن روی مانکن دست‌ساز در آتلیه تنظیم شده است.",
    fabric: "۱۰۰٪ ابریشم شسته",
    care: "شست‌وشوی دستی با مایع ابریشم یا خشک‌شویی.",
    price: 2450000,
    compareAtPrice: 2990000,
    category: "dresses",
    isFeatured: true,
    badge: "پرفروش",
    rating: 50,
    reviewCount: 211,
    images: [img(20620137), img(19141882)],
    sizes: ["XS", "S", "M", "L"],
    colors: [BLUSH, CREAM],
  },
  {
    slug: "avin-silk-shirt",
    name: "شومیز ابریشمی آوین",
    subtitle: "یقهٔ کلاسیک، آستین بلند",
    description:
      "شومیز آوین از ابریشم مات با دوخت فرانسوی ساخته شده است. جیب کوچک روی سینه و مچ دکمه‌دار، آن را از یک شومیز ساده جدا می‌کند.",
    story: "هر شومیز ۳ ساعت دوخت و ۴۰ دقیقه کنترل کیفیت دارد.",
    fabric: "۱۰۰٪ ابریشم",
    care: "شست‌وشوی دستی، اتوی خنک از پشت پارچه.",
    price: 1980000,
    compareAtPrice: 2400000,
    category: "dresses",
    isFeatured: true,
    badge: "جدید",
    rating: 47,
    reviewCount: 39,
    images: [img(7945666), img(34105296, "png")],
    sizes: ["S", "M", "L"],
    colors: [WHITE, CREAM],
  },
  {
    slug: "ava-merino-knit",
    name: "بافت مرینوس آوا",
    subtitle: "بافت ریز، یقهٔ گرد",
    description:
      "بافت آوا از پشم مرینوس اکسترافاین بافته می‌شود؛ سبک، بدون خارش و مناسب لایه‌گذاری. یقهٔ گرد و لبه‌های کشباف، فرم را در طول روز حفظ می‌کند.",
    story: "بافت این محصول در گارگاه بافت اصفهان با ماشین‌آلات ژاپنی انجام می‌شود.",
    fabric: "۱۰۰٪ پشم مرینوس اکسترافاین",
    care: "شست‌وشوی دستی با شامپو پشم، خشک کردن افقی.",
    price: 2150000,
    compareAtPrice: null,
    category: "knitwear",
    isFeatured: true,
    badge: "پیشنهاد ترمه",
    rating: 49,
    reviewCount: 148,
    images: [img(8667730), img(7428525)],
    sizes: ["XS", "S", "M", "L"],
    colors: [CREAM, OLIVE, BROWN],
  },
  {
    slug: "reel-cotton-tee",
    name: "تی‌شرت پنبهٔ ریل",
    subtitle: "پنبهٔ ارگانیک ۲۲۰ گرم",
    description:
      "تی‌شرت ریل با پنبهٔ ارگانیک ۲۲۰ گرمی و دوخت صاف، یک پایهٔ همیشگی در کمد است. فرم کمی آزاد و یقهٔ ریب مقاوم، بعد از شست‌وشو تغییر نمی‌کند.",
    story: "این تی‌شرت در ۶ رنگ و ۷ سایز تولید می‌شود و پرفروش‌ترین محصول ماست.",
    fabric: "۱۰۰٪ پنبهٔ ارگانیک، ۲۲۰ گرم",
    care: "ماشین لباسشویی ۳۰ درجه، پشت‌ورو بشویید.",
    price: 890000,
    compareAtPrice: 1150000,
    category: "knitwear",
    isFeatured: true,
    badge: "پرفروش",
    rating: 48,
    reviewCount: 433,
    images: [img(25745268), img(15185505)],
    sizes: ["S", "M", "L", "XL"],
    colors: [BLACK, WHITE, KHAKI],
  },
  {
    slug: "mahan-straight-jeans",
    name: "شلوار جین راسته ماهان",
    subtitle: "جین ۱۳ اونس، رنگ‌ثابت",
    description:
      "جین ماهان از پارچهٔ ۱۳ اونس با شست‌وشوی سنگ‌شور سبک تولید شده. فرم راسته و کمر متوسط، برای قدهای مختلف مناسب است.",
    story: "رنگ این جین با روش کم‌آب تثبیت می‌شود تا در شست‌وشوهای اول رنگ ندهد.",
    fabric: "۹۹٪ پنبه، ۱٪ الاستان",
    care: "شست‌وشوی سرد و پشت‌ورو.",
    price: 1790000,
    compareAtPrice: 2200000,
    category: "pants",
    isFeatured: true,
    badge: null,
    rating: 46,
    reviewCount: 97,
    images: [img(4614235), img(4614224), img(12456331)],
    sizes: ["30", "32", "34", "36", "38"],
    colors: [NAVY, BLACK],
  },
  {
    slug: "nivo-tailored-pants",
    name: "شلوار پارچه‌ای نیو",
    subtitle: "فرم راسته، کمر کشی مخفی",
    description:
      "شلوار نیو از پارچهٔ مخلوط پشم-ویسکوز با فرم راسته دوخته شده. کمر کشی مخفی، راحتی یک شلوار ورزشی را با ظاهر رسمی ترکیب می‌کند.",
    story: "این شلوار با مشورت ۳۰ مشتری در مرحلهٔ نمونه‌سازی اصلاح شد.",
    fabric: "۶۰٪ پشم، ۴۰٪ ویسکوز",
    care: "خشک‌شویی.",
    price: 1690000,
    compareAtPrice: null,
    category: "pants",
    isFeatured: false,
    badge: "جدید",
    rating: 47,
    reviewCount: 44,
    images: [img(12456331), img(17459774), img(17459735)],
    sizes: ["S", "M", "L", "XL"],
    colors: [KHAKI, NAVY, BLACK],
  },
  {
    slug: "rose-linen-set",
    name: "ست کتان خانگی رُز",
    subtitle: "کتان شسته، تیپ راحت",
    description:
      "ست رُز از کتان شسته با دوخت آزاد ساخته شده؛ برای خانه، سفر و تعطیلات. رنگ‌های مات و طبیعی، حس آرامش را کامل می‌کنند.",
    story: "کتان این ست بیش از ۵۰ بار شسته می‌شود تا نرمی نهایی را پیدا کند.",
    fabric: "۱۰۰٪ کتان شسته",
    care: "ماشین لباسشویی ۳۰ درجه، خشک کردن در سایه.",
    price: 2280000,
    compareAtPrice: 2750000,
    category: "sets",
    isFeatured: false,
    badge: "محدود",
    rating: 48,
    reviewCount: 36,
    images: [img(7428525), img(7788788)],
    sizes: ["S", "M", "L"],
    colors: [OLIVE, CREAM],
  },
  {
    slug: "amel-long-sleeve",
    name: "تی‌شرت آستین‌بلند اَمل",
    subtitle: "پنبهٔ پنبه‌ای، یقهٔ ریب",
    description:
      "آستین‌بلند اَمل برای روزهای خنک بهار طراحی شده. پنبهٔ ریسیدهٔ شانه‌زده، سطحی صاف و مقاوم دارد.",
    story: "اَمل نام روستایی در مازندران است که پنبهٔ آن از آنجا تأمین می‌شود.",
    fabric: "۱۰۰٪ پنبهٔ ریسیدهٔ شانه‌زده",
    care: "شست‌وشوی معمولی.",
    price: 1180000,
    compareAtPrice: null,
    category: "knitwear",
    isFeatured: false,
    badge: null,
    rating: 45,
    reviewCount: 28,
    images: [img(16453876), img(20900511)],
    sizes: ["M", "L", "XL"],
    colors: [KHAKI, GREY],
  },
];

const coupons = [
  ["TERMEH10", "percent", 10, 1000000, 500000, 500],
  ["NOWRUZ20", "percent", 20, 3000000, 1200000, 200],
  ["WELCOME150", "fixed", 150000, 1500000, null, 1000],
];

const client = new Client({ connectionString: DATABASE_URL });
await client.connect();

const force = process.argv.includes("--force");
const { rows: existing } = await client.query("select count(*)::int as c from products");
if (existing[0].c > 0 && !force) {
  console.log(`Seed skipped — ${existing[0].c} products already exist (use --force).`);
  await client.end();
  process.exit(0);
}

/**
 * Insert one product together with its images and size/color variants.
 * `index` drives both the "days back" date and the stock pattern, so the
 * same catalog always lands with identical demo data.
 */
async function insertProduct(p, categoryIds, index) {
  const { rows } = await client.query(
    `insert into products
      (slug, name, subtitle, description, story, fabric, care, price, compare_at_price,
       category_id, is_featured, is_active, badge, rating, review_count, created_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,$12,$13,$14, now() - ($15 || ' days')::interval)
     returning id`,
    [
      p.slug,
      p.name,
      p.subtitle,
      p.description,
      p.story,
      p.fabric,
      p.care,
      p.price,
      p.compareAtPrice,
      categoryIds[p.category],
      p.isFeatured,
      p.badge,
      p.rating,
      p.reviewCount,
      index * 4 + 2,
    ],
  );
  const productId = rows[0].id;

  for (let i = 0; i < p.images.length; i += 1) {
    await client.query(
      "insert into product_images (product_id, url, alt, sort_order) values ($1,$2,$3,$4)",
      [productId, p.images[i], `${p.name} — تصویر ${i + 1}`, i],
    );
  }

  for (let si = 0; si < p.sizes.length; si += 1) {
    for (let ci = 0; ci < p.colors.length; ci += 1) {
      const [colorName, colorHex] = p.colors[ci];
      let stock = ((index * 3 + si * 5 + ci * 7) % 9) + (ci === 0 ? 4 : 1);
      if ((index + si * 2 + ci * 3) % 13 === 0) stock = 0;
      if (p.slug === "reel-cotton-tee" && si < 2) stock = 0;
      await client.query(
        "insert into variants (product_id, size, color_name, color_hex, stock, sku) values ($1,$2,$3,$4,$5,$6)",
        [productId, p.sizes[si], colorName, colorHex, stock, `${p.slug}-${p.sizes[si]}-${ci}`],
      );
    }
  }

  return { id: productId, ...p };
}

if (existing[0].c > 0 && !force) {
  // ------------------------------------------------------------------
  // Append-only mode (default on a live store): add just the products
  // whose slug is missing. Orders, coupons, stock and existing products
  // stay completely untouched — no truncate, no data loss.
  // ------------------------------------------------------------------
  const { rows: catRows } = await client.query("select slug, id from categories");
  const appendCategoryIds = Object.fromEntries(catRows.map((row) => [row.slug, row.id]));

  for (const category of categories) {
    if (appendCategoryIds[category.slug]) continue;
    const { rows } = await client.query(
      "insert into categories (slug, name, tagline, image, sort_order) values ($1,$2,$3,$4,$5) returning id",
      [category.slug, category.name, category.tagline, category.image, category.sortOrder],
    );
    appendCategoryIds[category.slug] = rows[0].id;
  }

  const { rows: slugRows } = await client.query("select slug from products");
  const knownSlugs = new Set(slugRows.map((row) => row.slug));
  let added = 0;
  for (let arrayIndex = 0; arrayIndex < products.length; arrayIndex += 1) {
    const p = products[arrayIndex];
    if (knownSlugs.has(p.slug)) continue;
    await insertProduct(p, appendCategoryIds, arrayIndex);
    added += 1;
  }

  console.log(
    `Added ${added} new product(s) — ${knownSlugs.size} already existed. Orders, coupons and stock were untouched.`,
  );
  await client.end();
  process.exit(0);
}

if (existing[0].c > 0 && force) {
  await client.query(
    "truncate table order_items, orders, product_images, variants, products, categories, coupons, subscribers restart identity cascade",
  );
}

const categoryIds = {};
for (const category of categories) {
  const { rows } = await client.query(
    "insert into categories (slug, name, tagline, image, sort_order) values ($1,$2,$3,$4,$5) returning id",
    [category.slug, category.name, category.tagline, category.image, category.sortOrder],
  );
  categoryIds[category.slug] = rows[0].id;
}

const createdProducts = [];
for (let index = 0; index < products.length; index += 1) {
  createdProducts.push(await insertProduct(products[index], categoryIds, index));
}

for (const [code, type, value, minSubtotal, maxDiscount, maxUses] of coupons) {
  await client.query(
    "insert into coupons (code, type, value, min_subtotal, max_discount, max_uses, used_count, active) values ($1,$2,$3,$4,$5,$6,0,true)",
    [code, type, value, minSubtotal, maxDiscount, maxUses],
  );
}

// Demo orders so the admin dashboard has real history
const demoOrders = [
  {
    token: "demo-order-tok-1404",
    number: "TRM-1404-1042",
    name: "نگار احمدی",
    phone: "09121234567",
    province: "تهران",
    city: "تهران",
    address: "خیابان ولیعصر، کوچهٔ بهار، پلاک ۱۲، واحد ۴",
    postal: "1998745632",
    shipping: "tipax",
    ship: 89000,
    status: "delivered",
    payment: "paid",
    daysAgo: 12,
    items: [
      { slug: "mehr-wool-coat", size: "M", color: "کرم", qty: 1 },
      { slug: "reel-cotton-tee", size: "M", color: "مشکی", qty: 2 },
    ],
  },
  {
    token: "demo-order-tok-1405",
    number: "TRM-1404-1043",
    name: "سینا رستگار",
    phone: "09351112233",
    province: "اصفهان",
    city: "اصفهان",
    address: "خیابان چهارباغ بالا، برج آسمان، طبقهٔ ۹",
    postal: "8143567891",
    shipping: "post",
    ship: 59000,
    status: "shipped",
    payment: "paid",
    daysAgo: 4,
    items: [{ slug: "mahan-straight-jeans", size: "32", color: "سرمه‌ای", qty: 1 }],
  },
  {
    token: "demo-order-tok-1406",
    number: "TRM-1404-1044",
    name: "آیدا مرادی",
    phone: "09019876543",
    province: "فارس",
    city: "شیراز",
    address: "بلوار زند، کوچهٔ ۵، پلاک ۸",
    postal: "7145678901",
    shipping: "post",
    ship: 59000,
    status: "pending",
    payment: "pending",
    daysAgo: 1,
    items: [{ slug: "nila-silk-dress", size: "S", color: "صورتی خاکی", qty: 1 }],
  },
];

for (const order of demoOrders) {
  const lines = [];
  for (const item of order.items) {
    const product = createdProducts.find((p) => p.slug === item.slug);
    const { rows } = await client.query(
      "select id from variants where product_id = $1 and size = $2 and color_name = $3",
      [product.id, item.size, item.color],
    );
    lines.push({
      productId: product.id,
      variantId: rows[0]?.id ?? null,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      size: item.size,
      colorName: item.color,
      unitPrice: product.price,
      qty: item.qty,
      lineTotal: product.price * item.qty,
    });
  }
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const total = subtotal + order.ship;
  const { rows } = await client.query(
    `insert into orders
      (token, order_number, customer_name, phone, province, city, address, postal_code, note,
       shipping_method, shipping_cost, subtotal, discount, total, payment_status, status,
       carrier, tracking_code, sms_status, created_at, updated_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0,$13,$14,$15,$16,$17,'sent',
       now() - ($18 || ' days')::interval, now() - ($18 || ' days')::interval)
     returning id`,
    [
      order.token,
      order.number,
      order.name,
      order.phone,
      order.province,
      order.city,
      order.address,
      order.postal,
      null,
      order.shipping,
      order.ship,
      subtotal,
      total,
      order.payment,
      order.status,
      order.shipping === "tipax" ? "تیپاکس" : "پست جمهوری اسلامی",
      order.payment === "paid" ? `IR${Math.floor(100000000 + Math.random() * 800000000)}` : null,
      order.daysAgo,
    ],
  );
  for (const line of lines) {
    await client.query(
      `insert into order_items
        (order_id, product_id, variant_id, name, slug, image, size, color_name, unit_price, qty, line_total)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        rows[0].id,
        line.productId,
        line.variantId,
        line.name,
        line.slug,
        line.image,
        line.size,
        line.colorName,
        line.unitPrice,
        line.qty,
        line.lineTotal,
      ],
    );
  }
}

console.log(
  `Seeded ${createdProducts.length} products, ${categories.length} categories, ${coupons.length} coupons, ${demoOrders.length} demo orders.`,
);
await client.end();
