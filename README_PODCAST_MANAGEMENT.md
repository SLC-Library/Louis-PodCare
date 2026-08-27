# ⚡ คู่มือการจัดการวิดีโอแบบง่ายที่สุด (Quick & Minimal Guide)
### สำหรับ Louis PodCare Discovery

ตอนนี้คุณสามารถเพิ่มคลิปใหม่ได้ง่ายมาก โดยใส่เฉพาะข้อมูลจำเป็น เช่น **`youtubeUrl` (หรือ `youtubeId`)**, **`title`**, **`category`**, **`channel` (หรือ `institution`)** แล้วระบบจะจัดการข้อมูลส่วนที่เหลือให้อัตโนมัติ!

📍 **ไฟล์แก้ไขข้อมูล:** `/src/data/podcasts.ts`

---

## 🚀 ตัวอย่างการเพิ่มคลิปแบบสั้นที่สุด (ใส่เพียง 4-5 บรรทัด)

```typescript
createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Future of Robotic Surgery',
  category: 'Medical Tech',
  channel: 'SLC Hospital',
  description: 'คำอธิบายสรุปสั้น ๆ (ไม่ใส่ก็ได้)',
})
```

---

## 🤖 ข้อมูลที่ระบบคำนวณและดึงให้อัตโนมัติ (Auto-Filled)

| ข้อมูล | วิธีที่ระบบจัดการให้อัตโนมัติ |
| :--- | :--- |
| 🖼️ **`imageUrl` (รูปปก)** | **ไม่ต้องใส่!** ระบบจะดึงรูป Thumbnail ความละเอียดสูงจาก YouTube ให้ทันที (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`) |
| ⏱️ **`duration` (เวลา/ความยาว)** | หากไม่ได้ระบุ ระบบจะใส่ค่ามาตรฐาน และเมื่อเปิดเล่นผ่านโหมด Video หรือ Audio ตัวเล่นจะซิงค์เวลาจริงของคลิปให้อัตโนมัติ |
| 📅 **`date` (วันที่)** | หากไม่ได้ระบุ ระบบจะแสดงเป็น `"Latest"` หรือ `"Recent"` ให้อัตโนมัติ |
| 🔑 **`id` (รหัสคลิป)** | **ไม่ต้องใส่!** ระบบจะสร้าง `id` จาก `youtubeId` หรือจากชื่อเรื่องให้อัตโนมัติ เช่น `yt-dQw4w9WgXcQ` |
| 🩺 **`institutionIcon` (ไอคอน)** | **ไม่ต้องใส่!** ระบบจะเลือกไอคอน Material Symbol ให้ตรงตามหมวดหมู่โดยอัตโนมัติ (เช่น Cardiology -> ❤️, Nutrition -> 🥗, Psychology -> 🧠, Nursing -> 🛡️) |
| 🏷️ **`categorySlug`** | **ไม่ต้องใส่!** ระบบแปลงจากชื่อหมวดหมู่อัตโนมัติ |

---

## 🌟 1. การเปลี่ยนคลิปประจำสัปดาห์ (PODCAST OF THE WEEK)

ในไฟล์ `/src/data/podcasts.ts` บรรทัดประมาณ 60:

```typescript
export const FEATURED_PODCAST: PodcastItem = createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=30bZ_1Z2e1A',
  title: 'The Future of AI in Modern Surgery & Robotics',
  category: 'Medical Tech',
  channel: 'Johns Hopkins / SLC Medical',
  description: 'Dr. Sarah Chen discusses how machine learning algorithms...',
});
```

---

## 📋 2. การเพิ่ม / ลบคลิปวิดีโอทั่วไป (PODCAST_CARDS)

ในไฟล์ `/src/data/podcasts.ts` ภายในลิสต์ `PODCAST_CARDS`:

### ➕ เพิ่มคลิป:
```typescript
export const PODCAST_CARDS: PodcastItem[] = [
  // ก๊อปปี้บล็อกนี้ไปวางเพิ่ม:
  createPodcast({
    youtubeUrl: 'https://www.youtube.com/watch?v=รหัสคลิป',
    title: 'ชื่อหัวข้อคลิป',
    category: 'Cardiology', // ตรงกับ CATEGORIES
    channel: 'Mayo Clinic',  // หรือใส่ institution ก็ได้
  }),
  
  // รายการเดิม...
];
```

### ❌ ลบคลิป:
ลบทั้งบล็อก `createPodcast({ ... }),` ของรายการนั้นออก

---

## 🏷️ 3. การจัดการหมวดหมู่ (CATEGORIES)

```typescript
export const CATEGORIES = [
  'All',           // ⚠️ ห้ามลบ All
  'Nutrition',
  'Psychology',
  'Medical Tech',
  'Nursing',
  'Research',
  'Oncology',
  'Cardiology',
];
```
เพิ่มหรือเปลี่ยนชื่อหมวดหมู่ที่ต้องการได้เลยครับ!
