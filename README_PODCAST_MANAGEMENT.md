# ⚡ คู่มือการจัดการวิดีโอและเวลา (Quick & Minimal Guide)
### สำหรับ Louis PodCare Discovery

📍 **ไฟล์แก้ไขข้อมูลหลัก:** `/src/data/podcasts.ts`

---

## ⏱️ วิธีแก้ไขเวลา (Duration) ให้ตรงกับคลิปจริง

หากคลิปของคุณมีความยาว 35 นาที (หรือความยาวเท่าใดก็ตาม) ให้ระบุฟิลด์ `duration` ใน `createPodcast` ได้ทันที เช่น:

```typescript
createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=UKbrwLDnNIY',
  title: 'CRISPR Therapeutics in Rare Pediatric Conditions',
  category: 'Research',
  channel: 'Stanford Health Care',
  duration: '35:00', // 👈 ใส่เวลาได้ทุกรูปแบบ เช่น '35:00', '35 mins', '35 นาที'
})
```

> **รูปแบบเวลาที่รองรับ:**
> * `duration: '35:00'` (นาที:วินาที)
> * `duration: '35 mins'` หรือ `duration: '35 นาที'`
> * `duration: '1:15:00'` (ชั่วโมง:นาที:วินาที)

---

## 🚀 ตัวอย่างการใส่ข้อมูลคลิปใหม่ (ใส่เฉพาะสิ่งสำคัญ)

```typescript
createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Future of Robotic Surgery',
  category: 'Medical Tech',
  channel: 'SLC Hospital',
  duration: '35:00', // 👈 ระบุความยาวจริง
  description: 'คำอธิบายสรุปสั้น ๆ (ไม่ใส่ก็ได้)',
})
```

---

## 🤖 ข้อมูลที่ระบบจัดการให้อัตโนมัติ (Auto-Filled)

| ข้อมูล | การทำงานอัตโนมัติของระบบ |
| :--- | :--- |
| 🖼️ **`imageUrl` (รูปปก)** | ดึงภาพหน้าปกคมชัดจาก YouTube ให้อัตโนมัติ (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`) |
| ⏱️ **Real-Time Duration Sync** | เมื่อผู้ใช้กดเปิดดูคลิป เครื่องเล่น YouTube จะตรวจจับเวลาจริงจากตัวเล่นแบบเรียลไทม์ให้อัตโนมัติ |
| 📅 **`date` (วันที่)** | หากไม่ได้ระบุ จะแสดงเป็น `"Latest"` หรือ `"Recent"` ให้อัตโนมัติ |
| 🔑 **`id` (รหัสคลิป)** | สร้างรหัสจาก YouTube ID ให้อัตโนมัติ เช่น `yt-dQw4w9WgXcQ` |
| 🩺 **`institutionIcon` (ไอคอน)** | เลือกไอคอน Material Symbol ให้ตรงตามหมวดหมู่โดยอัตโนมัติ (Cardiology -> ❤️, Nutrition -> 🥗, Psychology -> 🧠) |

---

## 🌟 1. การเปลี่ยนคลิปประจำสัปดาห์ (PODCAST OF THE WEEK)

ในไฟล์ `/src/data/podcasts.ts` บรรทัดประมาณ 60:

```typescript
export const FEATURED_PODCAST: PodcastItem = createPodcast({
  youtubeUrl: 'https://www.youtube.com/watch?v=30bZ_1Z2e1A',
  title: 'The Future of AI in Modern Surgery & Robotics',
  category: 'Medical Tech',
  channel: 'Johns Hopkins / SLC Medical',
  duration: '45 mins', // 👈 ความยาวของคลิปประจำสัปดาห์
  description: 'Dr. Sarah Chen discusses how machine learning algorithms...',
});
```

---

## 📋 2. การเพิ่ม / ลบคลิปวิดีโอทั่วไป (PODCAST_CARDS)

ในไฟล์ `/src/data/podcasts.ts` ภายในลิสต์ `PODCAST_CARDS`:

### ➕ เพิ่มคลิป:
```typescript
export const PODCAST_CARDS: PodcastItem[] = [
  createPodcast({
    youtubeUrl: 'https://www.youtube.com/watch?v=รหัสคลิป',
    title: 'ชื่อหัวข้อคลิป',
    category: 'Cardiology',
    channel: 'Mayo Clinic',
    duration: '35:00', // 👈 ใส่เวลาของคลิปนี้
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
