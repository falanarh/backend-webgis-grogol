# Backend WebGIS Grogol

Repositori ini merupakan proyek backend website peta tematik desa cantik untuk pemetaan Usaha Sayuran Desa Grogol. Proyek ini mengimplementasikan konsep RESTful API yang sering menjadi standar dalam pembuatan backend website. API ini dibangun menggunakan Node.js, TypeScript, Express, dan MongoDB.

## Daftar Isi

- [Fitur](#fitur)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Library Penting](#library-penting)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Endpoint API](#endpoint-api)

## Fitur

- **RESTful API** untuk mengelola data `Usaha Sayuran`, `RT` (Rukun Tetangga), dan `Admin`.
- Menggunakan **MongoDB** untuk penyimpanan data, dengan **Mongoose** sebagai ODM (Object Data Modeling).
- **JWT (JSON Web Token)** untuk autentikasi yang aman.
- **Logging** menggunakan **Winston**.
- **TypeScript** untuk keamanan tipe.

## Struktur Proyek

```
backend-webgis-grogol/
├── src/
│ ├── config/ # Konfigurasi aplikasi
│ ├── controllers/ # Logic handler untuk setiap route
│ ├── middleware/ # Middleware Express
│ ├── models/ # Model data Mongoose
│ ├── routes/ # Definisi route API
│ ├── services/ # Business logic
│ ├── types/ # Type definitions
│ ├── utils/ # Utility functions
│ ├── app.ts # Konfigurasi Express app
│ └── server.ts # Entry point aplikasi
├── .env # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json # Konfigurasi TypeScript
└── README.md
```


## Instalasi

Untuk memulai proyek ini, clone repositori dan instal dependensi:

```bash
git clone https://github.com/falanarh/backend-webgis-grogol.git
cd backend-webgis-grogol
npm install
```

## Menjalankan Aplikasi

* Untuk pengembangan lokal:

```bash
npm run dev
```
* Untuk build produksi:
```bash
npm run build
npm start
```

## Library Penting

- **Express**: Framework ringan untuk membangun REST API di Node.js.
- **Mongoose**: Library ODM untuk MongoDB dan Node.js.
- **JSON Web Token (JWT)**: Digunakan untuk autentikasi dan pengiriman informasi dengan aman.
- **Winston**: Library logging yang serbaguna untuk aplikasi Node.js.
- **TypeScript**: Bahasa pemrograman yang menambahkan tipe statis pada JavaScript, memberikan alat pengembangan yang lebih baik.

## Variabel Lingkungan

Untuk melakukan konfigurasi database MongoDB yang digunakan dalam proyek, perlu menyiapkan file .env untuk menyimpan berbagai variabel lingkungan yang diperlukan. File .env secara khusus untuk proyek ini dapat diperoleh melalui link berikut ini https://drive.google.com/file/d/1YPVNOTNExUKZpXb6bjpU2eHmtciUE4s7/view?usp=sharing.

## Endpoint API

### 1. Registrasi Admin

* **Metode:** POST
* **URL:** `/api/auth/register`
* **Deskripsi:** Endpoint ini digunakan untuk mendaftarkan pengguna baru sebagai admin.
* **Request Body:**
  ```json
  {
    "username": "admin123",
    "password": "admin123"
  }
  ```
* **Response:**
  * **Status Code:**
    * `201 Created` - Admin berhasil didaftarkan
    * `500 Internal Server Error` - Terjadi kesalahan pada server
  * **Body Response (Sukses):**
    ```json
    {
        "statusCode": 201,
        "message": "Admin registered successfully",
        "data": {
            "_id": "ObjectId",
            "username": "admin123"
        }
    }
    ```
  * **Body Response (Gagal):**
    ```json
    {
        "statusCode": 500,
        "message": "Error message"
    }
    ```
### 2. Login Admin

* **Metode:** POST
* **URL:** `/api/auth/login`
* **Deskripsi:** Endpoint ini digunakan untuk masuk sebagai admin.
* **Request Body:**
  ```json
  {
    "username": "admin123",
    "password": "admin123"
  }
  ```
* **Response:**
  * **Status Code:**
    * `200 OK` - Login berhasil
    * `400 Bad Request` - Username atau password salah
  * **Body Response (Sukses):**
    ```json
    {
        "statusCode": 200,
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  * **Body Response (Gagal):**
    ```json
    {
        "statusCode": 400,
        "message": "Username tidak ditemukan atau Password salah"
    }
    ```