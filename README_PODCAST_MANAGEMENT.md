# 📚 คู่มือการจัดการเนื้อหาและวิดีโอ (Content Management Guide)
### สำหรับแอปพลิเคชัน Louis PodCare Discovery

ข้อมูลทั้งหมดของรายการวิดีโอ พอดแคสต์ หมวดหมู่ (Category) และคลิปประจำสัปดาห์ (Podcast of the Week) จะถูกรวบรวมไว้ที่ไฟล์เดียวเพื่อให้ง่ายต่อการจัดการ:
📍 **ไฟล์หลัก:** `/src/data/podcasts.ts`

---

## 📑 สารบัญ
1. [โครงสร้างภาพรวมของไฟล์ `/src/data/podcasts.ts`](#1-โครงสร้างภาพรวมของไฟล์)
2. [ส่วนที่ 1: คลิปประจำสัปดาห์ (FEATURED_PODCAST / PODCAST OF THE WEEK)](#2-ส่วนที่-1-คลิปประจำสัปดาห์-featured_podcast)
3. [ส่วนที่ 2: วิดีโอและพอดแคสต์ทั่วไป (PODCAST_CARDS และ MORE_PODCAST_CARDS)](#3-ส่วนที่-2-วิดีโอและพอดแคสต์ทั่วไป)
4. [วิธีเพิ่ม ลบ หรือแก้ไขวิดีโอ](#4-วิธีเพิ่ม-ลบ-หรือแก้ไขวิดีโอ)
5. [วิธีจัดการหมวดหมู่ (CATEGORIES)](#5-วิธีจัดการหมวดหมู่-categories)
6. [คำอธิบายฟิลด์ข้อมูลทั้งหมด (Field Reference)](#6-คำอธิบายฟิลด์ข้อมูลทั้งหมด)

---

## 1. โครงสร้างภาพรวมของไฟล์
ภายในไฟล์ `/src/data/podcasts.ts` จะแบ่งตัวแปรออกเป็น 4 ส่วนหลัก:

| ตัวแปร | หน้าที่ / ตำแหน่งการแสดงผล |
| :--- | :--- |
| `FEATURED_PODCAST` | แบนเนอร์ขนาดใหญ่ด้านบนสุด (**PODCAST & VIDEO OF THE WEEK**) |
| `PODCAST_CARDS` | รายการวิดีโอชุดแรกที่แสดงใน Grid ทันทีที่เปิดหน้าเว็บ |
| `MORE_PODCAST_CARDS` | รายการวิดีโอชุดที่จะแสดงเพิ่มเมื่อผู้ใช้กดปุ่ม **"Load More Insights"** |
| `CATEGORIES` | ปุ่มชิปตัวกรองหมวดหมู่ (Filter Chips) ด้านบน เช่น Nutrition, Cardiology |

---

## 2. ส่วนที่ 1: คลิปประจำสัปดาห์ (`FEATURED_PODCAST`)
ตำแหน่ง: แบนเนอร์ใหญ่บนสุดของหน้าหลัก

```typescript
export const FEATURED_PODCAST: PodcastItem = {
  id: 'featured-ai-surgery',                          // ไอดีประจำคลิป (ห้ามซ้ำกัน)
  title: 'The Future of AI in Modern Surgery & Robotics', // ชื่อเรื่อง
  category: 'Medical Tech',                          // หมวดหมู่
  categorySlug: 'medical-tech',
  institution: 'Johns Hopkins / SLC Medical',        // สถาบัน หรือ ชื่อผู้จัดทำ
  institutionIcon: 'podcasts',                       // ไอคอน Material Symbols
  duration: '45 mins',                               // ความยาวคลิป
  date: 'Oct 12, 2023',                              // วันที่เผยแพร่
  description:
    'Dr. Sarah Chen discusses how machine learning algorithms are revolutionizing robotic-assisted surgeries...',
  imageUrl:
    'https://lh3.googleusercontent.com/...',         // รูปภาพหน้าปก
  imageAlt:
    'A highly cinematic, wide-angle shot of a glowing holographic brain...',
  
  // 👉 ลิงก์ YouTube: ใส่ได้ทั้ง ID 11 ตัว หรือใส่ URL เต็ม
  youtubeId: '30bZ_1Z2e1A',
  youtubeUrl: 'https://www.youtube.com/watch?v=30bZ_1Z2e1A',
};
```

---

## 3. ส่วนที่ 2: วิดีโอและพอดแคสต์ทั่วไป
แบ่งเป็น 2 ชุดอาร์เรย์ (`PODCAST_CARDS` และ `MORE_PODCAST_CARDS`):

```typescript
export const PODCAST_CARDS: PodcastItem[] = [
  {
    id: 'genomic-sequencing',
    title: 'Advancements in Genomic Sequencing & Diagnostics',
    category: 'Medical Tech',
    categorySlug: 'medical-tech',
    institution: 'Mayo Clinic',
    institutionIcon: 'local_hospital',
    duration: '12:30',
    imageUrl: 'https://images.unsplash.com/...',
    imageAlt: 'DNA double helix model',
    description: 'Exploring how long-read sequencing technologies are unlocking personalized therapies...',
    youtubeId: 'YnZe2Gj_R_o',
    youtubeUrl: 'https://www.youtube.com/watch?v=YnZe2Gj_R_o',
  },
  // รายการอื่น ๆ ...
];
```

> **💡 หมายเหตุ:** หากต้องการให้การ์ดใดมีความกว้างพิเศษ 2 คอลัมน์ (Wide Card) ให้ใส่ `span2: true`

---

## 4. วิธีเพิ่ม ลบ หรือแก้ไขวิดีโอ

### 4.1 วิธีเปลี่ยนลิงก์ YouTube:
ระบบรองรับ 2 รูปแบบ:
1. **แบบ Video ID (11 หลัก):** เช่น `'dQw4w9WgXcQ'`
2. **แบบ URL เต็ม:** เช่น `'https://www.youtube.com/watch?v=dQw4w9WgXcQ'` หรือ `'https://youtu.be/dQw4w9WgXcQ'`

### 4.2 วิธีเพิ่มวิดีโอใหม่:
ก๊อปปี้บล็อกด้านล่างไปวางต่อท้ายในอาร์เรย์ `PODCAST_CARDS` หรือ `MORE_PODCAST_CARDS`:

```typescript
{
  id: 'my-new-podcast-id',                 // 1. ตั้งไอดีใหม่ไม่ให้ซ้ำกับรายการอื่น
  title: 'ชื่อหัวข้อคลิปวิดีโอหรือพอดแคสต์',  // 2. ใส่ชื่อเรื่อง
  category: 'Cardiology',                  // 3. ใส่หมวดหมู่ (ให้ตรงกับใน CATEGORIES)
  categorySlug: 'cardiology',
  institution: 'ชื่อสถาบันหรือผู้บรรยาย',     // 4. ใส่ชื่อสถาบัน/ช่อง
  institutionIcon: 'monitor_heart',        // 5. ไอคอน (Material Symbol)
  duration: '25:00',                       // 6. ความยาว เช่น 25:00 หรือ 25 mins
  imageUrl: 'https://url-รูปหน้าปก.jpg',      // 7. รูปหน้าปก (หรือใช้รูปจาก YouTube Thumbnail)
  imageAlt: 'คำอธิบายรูปหน้าปก',
  description: 'คำอธิบายสรุปเนื้อหาสั้น ๆ 2-3 บรรทัด',
  youtubeId: 'ID_วิดีโอ_11_หลัก',
  youtubeUrl: 'https://www.youtube.com/watch?v=ID_วิดีโอ_11_หลัก',
},
```

> **เคล็ดลับการดึงรูปปกจาก YouTube อัตโนมัติ:**
> รูปปก YouTube คุณภาพสูงสามารถใช้ URL: `https://img.youtube.com/vi/<YOUTUBE_ID>/maxresdefault.jpg` ได้ทันที

### 4.3 วิธีลบวิดีโอ:
ลบทั้งบล็อก `{ ... }` ของรายการนั้นออกจากอาร์เรย์ `PODCAST_CARDS` หรือ `MORE_PODCAST_CARDS`

---

## 5. วิธีจัดการหมวดหมู่ (CATEGORIES)

เลื่อนลงมาที่บรรทัดประมาณ 150 ในไฟล์ `/src/data/podcasts.ts` จะพบตัวแปร:

```typescript
export const CATEGORIES = [
  'All',           // ⚠️ ห้ามลบ 'All' เพราะเป็นปุ่มแสดงทั้งหมด
  'Nutrition',
  'Psychology',
  'Medical Tech',
  'Nursing',
  'Research',
  'Oncology',
  'Cardiology',
];
```

* **ต้องการเพิ่มหมวดหมู่ใหม่:** เพิ่มชื่อต่อท้ายในลิสต์ เช่น `'Dermatology'`, `'Pediatrics'`
* **ต้องการเปลี่ยนชื่อหรือลบ:** แก้ไขข้อความในลิสต์นี้ได้โดยตรง
* ⚠️ **ข้อควรระวัง:** เมื่อเปลี่ยนชื่อหมวดหมู่ใน `CATEGORIES` แล้ว อย่าลืมตรวจสอบฟิลด์ `category: '...'` ในแต่ละคลิปให้สะกดตรงกันด้วย (Case-insensitive)

---

## 6. คำอธิบายฟิลด์ข้อมูลทั้งหมด

| ฟิลด์ | ชนิดข้อมูล | จำเป็นหรือไม่ | คำอธิบาย |
| :--- | :--- | :---: | :--- |
| `id` | `string` | ✅ จำเป็น | รหัสเฉพาะห้ามซ้ำกัน ใช้สำหรับระบบ Bookmark และระบุตัวคลิป |
| `title` | `string` | ✅ จำเป็น | ชื่อหัวข้อคลิปหรือบทความ |
| `category` | `string` | ✅ จำเป็น | ชื่อหมวดหมู่ (เช่น `'Medical Tech'`, `'Nutrition'`) |
| `institution` | `string` | ✅ จำเป็น | ชื่อสถาบัน ผู้สอน หรือโรงพยาบาล |
| `duration` | `string` | ✅ จำเป็น | ความยาวคลิป เช่น `'15:30'` หรือ `'45 mins'` |
| `imageUrl` | `string` | ✅ จำเป็น | URL รูปภาพหน้าปกการ์ด |
| `youtubeId` | `string` | ✅ แนะนำ | รหัส YouTube Video ID (11 ตัวอักษร) |
| `youtubeUrl` | `string` | ✅ แนะนำ | ลิงก์เต็มไปยังวิดีโอบน YouTube |
| `description` | `string` | ⚪ มีหรือไม่มีก็ได้ | คำอธิบายเนื้อหา |
| `institutionIcon` | `string` | ⚪ มีหรือไม่มีก็ได้ | ชื่อ Material Symbol เช่น `local_hospital`, `psychology`, `biotech` |
| `span2` | `boolean` | ⚪ มีหรือไม่มีก็ได้ | หากใส่ `true` การ์ดจะกว้าง 2 ช่องบนจอคอมพิวเตอร์ |
