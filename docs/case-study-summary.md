# Real-World Case Study: Inspirasi EduGraph

Pengembangan **EduGraph** didasarkan pada studi kasus nyata dari implementasi *Knowledge Graph* di **National Aeronautics and Space Administration (NASA)**. 

## Latar Belakang Masalah
Sebagai lembaga antariksa raksasa, NASA memiliki lebih dari 20 pusat riset independen dan ratusan ribu pegawai serta kontraktor. Selama puluhan tahun, data mereka tersimpan dalam **Data Silos** (basis data relasional yang terfragmentasi dan terisolasi satu sama lain). 

Akibatnya, NASA menghadapi masalah serius:
1. **Pencarian Keahlian yang Lambat:** Membutuhkan waktu berminggu-minggu untuk menemukan insinyur atau ilmuwan dengan keahlian spesifik lintas departemen.
2. **Kehilangan Pengetahuan Institusional:** Saat insinyur senior pensiun, wawasan (*lessons learned*) dari proyek masa lalu sering kali hilang karena tidak terhubung dengan dokumentasi atau personel lain secara sistematis.

## Solusi Implementasi
NASA mengatasi krisis informasi ini dengan membangun **Knowledge Graph** menggunakan **Neo4j**. Mereka berhenti menggunakan tabel relasional kaku dan mulai merepresentasikan data sebagai jaringan.
* **Nodes:** Pegawai, Keahlian, Dokumen Proyek, Komponen Mesin.
* **Relationships:** Siapa yang *MENGUASAI* keahlian apa, siapa yang *BEKERJA SAMA* dengan siapa, dan proyek apa yang *MEMBUTUHKAN* komponen apa.

## Hasil & Dampak
* Pencarian informasi dan keahlian yang dulunya memakan waktu berminggu-minggu kini dapat diselesaikan dalam **hitungan detik**.
* Hubungan antar-data yang sebelumnya tersembunyi kini dapat divisualisasikan, meminimalisir kesalahan operasional dan mencegah redundansi riset.

## Korelasi dengan EduGraph
EduGraph mengadaptasi solusi NASA ke dalam skala institusi akademik (Universitas). Di lingkungan kampus, data sering kali terperangkap dalam *Data Silos* seperti:
* Data Mata Kuliah & Dosen di **Sistem Informasi Akademik (SIAK)**.
* Data Jejak Karir di **Database Alumni**.
* Data Riset di **Portal Jurnal Publikasi**.

Dengan mereplikasi *Knowledge Graph* Neo4j, EduGraph melebur batas-batas data tersebut ke dalam satu jaringan besar. Mahasiswa kini dapat dengan mudah menemukan pola dan hubungan langsung antara mata kuliah yang mereka ambil, keahlian yang akan didapat, dosen spesialis yang bisa dijadikan mentor, hingga prospek karir nyata dari kakak tingkat (alumni).
