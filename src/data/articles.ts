import { ArticleItem } from '../types';

export const SAINT_LOUIS_ARTICLE_CATEGORIES = [
  'ทั้งหมด',
  'สาระสุขภาพ',
  'ข่าวสารและกิจกรรม',
  'นวัตกรรมทางการแพทย์',
  'ศูนย์เฉพาะทาง',
  'โภชนาการและไลฟ์สไตล์',
];

export const FEATURED_ARTICLE: ArticleItem = {
  id: 'slh-featured-cardio-2025',
  title: 'การตรวจคัดกรองหลอดเลือดหัวใจตีบด้วย CT Coronary Angiography และการดูแลหัวใจเชิงป้องกัน',
  category: 'สาระสุขภาพ',
  department: 'ศูนย์หัวใจ โรงพยาบาลเซนต์หลุยส์ (Heart Center)',
  date: '20 ก.พ. 2025',
  readTime: '4 นาที',
  summary:
    'รู้จักสัญญาณเตือนโรคหลอดเลือดหัวใจตีบ นวัตกรรมการเอกซเรย์คอมพิวเตอร์ความเร็วสูงเพื่อตรวจคัดกรองคราบหินปูนในหลอดเลือดหัวใจ (Calcium Score) อย่างแม่นยำ พร้อมแนวทางปฏิบัติตนเพื่อสุขภาพหัวใจที่แข็งแรงยืนยาว',
  imageUrl:
    'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1200&auto=format&fit=crop',
  url: 'https://www.saintlouis.or.th/contents',
  featured: true,
  tags: ['โรคหัวใจ', 'Calcium Score', 'CT Scan', 'สุขภาพหลอดเลือด'],
};

export const SAINT_LOUIS_ARTICLES: ArticleItem[] = [
  {
    id: 'slh-article-1',
    title: 'เทคนิคปรับพฤติกรรมลดความเสี่ยงภาวะดื้ออินซูลินและเบาหวานในวัยทำงาน',
    category: 'โภชนาการและไลฟ์สไตล์',
    department: 'ศูนย์เบาหวาน ต่อมไร้ท่อ และควบคุมน้ำหนัก รพ.เซนต์หลุยส์',
    date: '18 ก.พ. 2025',
    readTime: '3 นาที',
    summary:
      'ภาวะดื้ออินซูลินเป็นภัยเงียบที่มักไม่แสดงอาการในช่วงแรก เจาะลึกการจัดสัดส่วนมื้ออาหาร การเลือกคาร์โบไฮเดรตเชิงซ้อน และการออกกำลังกายที่ช่วยฟื้นฟูความไวของอินซูลิน',
    imageUrl:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
    url: 'https://www.saintlouis.or.th/contents',
    tags: ['เบาหวาน', 'ดื้ออินซูลิน', 'โภชนาการ', 'วัยทำงาน'],
  },
  {
    id: 'slh-article-2',
    title: 'นวัตกรรมการผ่าตัดส่องกล้องแผลเล็ก (Minimally Invasive Surgery: MIS) ฟื้นตัวไว ไร้รอยแผลใหญ่',
    category: 'นวัตกรรมทางการแพทย์',
    department: 'ศูนย์ศัลยกรรม รพ.เซนต์หลุยส์ (Surgery Center)',
    date: '12 ก.พ. 2025',
    readTime: '5 นาที',
    summary:
      'เทคโนโลยีผ่าตัดผ่านกล้องความละเอียดสูงช่วยให้ศัลยแพทย์มองเห็นรอยโรคได้ชัดเจนขึ้น ลดการบาดเจ็บของเนื้อเยื่อข้างเคียง ลดการเสียเลือด และผู้ป่วยสามารถกลับไปใช้ชีวิตประจำวันได้รวดเร็วขึ้น',
    imageUrl:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
    url: 'https://www.saintlouis.or.th/contents',
    tags: ['ผ่าตัดส่องกล้อง', 'MIS', 'ศัลยกรรม', 'นวัตกรรมการรักษา'],
  },
  {
    id: 'slh-article-3',
    title: 'วัคซีนป้องกันโรคสำหรับผู้ใหญ่และผู้สูงอายุ สิ่งจำเป็นที่ไม่ควรมองข้าม',
    category: 'สาระสุขภาพ',
    department: 'ศูนย์สร้างเสริมสุขภาพและวัคซีน รพ.เซนต์หลุยส์',
    date: '05 ก.พ. 2025',
    readTime: '4 นาที',
    summary:
      'เพราะภูมิคุ้มกันร่างกายลดลงตามวัย การฉีดวัคซีนป้องกันไข้หวัดใหญ่สายพันธุ์ใหม่ วัคซีนงูสวัด วัคซีนปอดอักเสบ และวัคซีน RSV จึงเป็นเกราะป้องกันสำคัญสำหรับคนที่คุณรัก',
    imageUrl:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
    url: 'https://www.saintlouis.or.th/contents',
    tags: ['วัคซีนผู้ใหญ่', 'ผู้สูงอายุ', 'ไข้หวัดใหญ่', 'งูสวัด'],
  },
  {
    id: 'slh-article-4',
    title: 'ตรวจสุขภาพประจำปี เลือกแพ็กเกจอย่างไรให้ตรงกับช่วงวัยและไลฟ์สไตล์',
    category: 'ข่าวสารและกิจกรรม',
    department: 'ศูนย์ตรวจสุขภาพ รพ.เซนต์หลุยส์ (Executive Health Center)',
    date: '28 ม.ค. 2025',
    readTime: '3 นาที',
    summary:
      'คู่มือการเลือกโปรแกรมตรวจสุขภาพสำหรับช่วงอายุ 20+, 30+, 40+ และ 50+ ปีขึ้นไป พร้อมคำแนะนำการเตรียมตัวก่อนเข้ารับการตรวจ เพื่อให้ได้ผลลัพธ์ที่แม่นยำที่สุด',
    imageUrl:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
    url: 'https://www.saintlouis.or.th/contents',
    tags: ['ตรวจสุขภาพ', 'แพ็กเกจสุขภาพ', 'ป้องกันโรค'],
  },
  {
    id: 'slh-article-5',
    title: 'Office Syndrome สัญญาณเตือนอาการปวดเรื้อรัง และการทำกายภาพบำบัดฟื้นฟูกล้ามเนื้อ',
    category: 'ศูนย์เฉพาะทาง',
    department: 'ศูนย์กายภาพบำบัดและเวชศาสตร์ฟื้นฟู รพ.เซนต์หลุยส์',
    date: '20 ม.ค. 2025',
    readTime: '4 นาที',
    summary:
      'อาการปวดคอ บ่า ไหล่ และหลังจากการนั่งทำงานนาน รักษาให้ตรงจุดด้วยเครื่องมือฟื้นฟูทางกายภาพบำบัด การจัดสรีรศาสตร์โต๊ะทำงาน และท่ายืดเหยียดที่ทำได้เองทุกวัน',
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    url: 'https://www.saintlouis.or.th/contents',
    tags: ['Office Syndrome', 'กายภาพบำบัด', 'ปวดหลัง', 'เวชศาสตร์ฟื้นฟู'],
  },
  {
    id: 'slh-article-6',
    title: 'การดูแลสุขภาพใจ (Mental Health) เมื่อความเครียดสะสมเริ่มส่งผลต่อร่างกาย',
    category: 'สาระสุขภาพ',
    department: 'คลินิกส่งเสริมสุขภาพจิตและจิตเวช รพ.เซนต์หลุยส์',
    date: '15 ม.ค. 2025',
    readTime: '4 นาที',
    summary:
      'เรียนรู้กลไก Somatization เมื่อความเครียดแปรเปลี่ยนเป็นอาการปวดหัว นอนไม่หลับ แน่นท้อง พร้อมวิธีตั้งรับทางอารมณ์และการขอคำปรึกษาจากแพทย์ผู้เชี่ยวชาญ',
    imageUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    url: 'https://www.saintlouis.or.th/contents',
    tags: ['สุขภาพจิต', 'คลายเครียด', 'นอนไม่หลับ', 'จิตเวช'],
  },
];

export const SAINT_LOUIS_CONTACT = {
  name: 'โรงพยาบาลเซนต์หลุยส์ (Saint Louis Hospital)',
  website: 'https://www.saintlouis.or.th',
  contentsUrl: 'https://www.saintlouis.or.th/contents',
  appointmentUrl: 'https://www.saintlouis.or.th',
  phone: '02-838-5555',
  emergencyPhone: '02-675-5000',
  address: '215 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพฯ 10120',
};
