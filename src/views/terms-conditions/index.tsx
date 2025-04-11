import React from "react";
import { reggae } from "@/app/fonts";

const TermsConditionsView = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-2">
            Ketentuan Layanan
          </span>
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${reggae.className}`}
          >
            Terms & Conditions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Terakhir diperbarui: 11 April 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Pendahuluan</h2>
          <p className="text-gray-700 mb-4">
            Selamat datang di Oknum. Syarat dan Ketentuan ini mengatur
            penggunaan Anda atas layanan yang disediakan oleh Oknum ("Kami",
            "Kita", atau "Perusahaan kami"), termasuk situs web, aplikasi, dan
            layanan digital lainnya.
          </p>
          <p className="text-gray-700 mb-4">
            Dengan mengakses atau menggunakan layanan kami, Anda menyetujui
            untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju
            dengan bagian apa pun dari ketentuan ini, Anda tidak diizinkan untuk
            mengakses layanan kami.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Penerimaan Ketentuan
          </h2>
          <p className="text-gray-700 mb-4">
            Dengan mengakses atau menggunakan layanan kami, Anda menyatakan
            bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat
            oleh Syarat dan Ketentuan ini. Anda juga menyatakan bahwa Anda telah
            membaca dan memahami Kebijakan Privasi kami, yang juga mengatur
            penggunaan Anda atas layanan kami.
          </p>
          <p className="text-gray-700 mb-4">
            Jika Anda menggunakan layanan kami atas nama organisasi (seperti
            perusahaan atau entitas bisnis), Anda menyatakan dan menjamin bahwa
            Anda memiliki wewenang untuk mengikat organisasi tersebut pada
            Syarat dan Ketentuan ini.
          </p>
        </div>

        {/* Eligibility */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Kelayakan Pengguna
          </h2>
          <p className="text-gray-700 mb-4">
            Untuk menggunakan layanan kami, Anda harus berusia minimal 18 tahun
            atau usia legal di yurisdiksi Anda (mana yang lebih tinggi). Dengan
            menggunakan layanan kami, Anda menyatakan dan menjamin bahwa Anda
            memenuhi persyaratan kelayakan ini.
          </p>
          <p className="text-gray-700 mb-4">
            Jika Anda menggunakan layanan atas nama organisasi, Anda menyatakan
            bahwa organisasi tersebut secara sah terbentuk dan beroperasi sesuai
            dengan hukum yang berlaku di yurisdiksinya.
          </p>
        </div>

        {/* Service Description */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Deskripsi Layanan
          </h2>
          <p className="text-gray-700 mb-4">
            Oknum menyediakan berbagai layanan pengembangan digital, termasuk
            namun tidak terbatas pada pengembangan website, aplikasi mobile, dan
            solusi digital lainnya. Layanan spesifik yang disediakan akan
            dijelaskan secara terperinci dalam kontrak atau perjanjian terpisah
            antara Oknum dan klien.
          </p>
          <p className="text-gray-700 mb-4">
            Kami berupaya untuk memberikan layanan berkualitas tinggi, tetapi
            tidak menjamin bahwa layanan kami akan selalu tersedia tanpa
            gangguan atau bebas dari kesalahan. Kami berhak untuk memodifikasi,
            memperbaiki, atau meningkatkan layanan kami dari waktu ke waktu.
          </p>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Hak Kekayaan Intelektual
          </h2>
          <p className="text-gray-700 mb-4">
            Semua hak kekayaan intelektual terkait dengan layanan kami, termasuk
            namun tidak terbatas pada konten, logo, merek dagang, desain, dan
            perangkat lunak, adalah milik Oknum atau pemberi lisensinya. Tidak
            ada ketentuan dalam Syarat dan Ketentuan ini yang memberikan Anda
            hak untuk menggunakan kekayaan intelektual tersebut tanpa izin
            tertulis dari Oknum.
          </p>
          <p className="text-gray-700 mb-4">
            Kecuali disepakati secara tertulis dalam kontrak terpisah,
            kepemilikan atas kekayaan intelektual yang dihasilkan melalui
            layanan kami (seperti kode, desain, atau konten yang dikembangkan
            untuk klien) akan diatur oleh ketentuan dalam kontrak tersebut.
          </p>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Pembatasan Penggunaan
          </h3>
          <p className="text-gray-700 mb-4">Anda dilarang untuk:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Menyalin, memodifikasi, atau mendistribusikan konten dari layanan
              kami tanpa izin tertulis
            </li>
            <li className="mb-2">
              Menggunakan merek dagang, logo, atau elemen branding kami tanpa
              izin tertulis
            </li>
            <li className="mb-2">
              Melakukan rekayasa balik (reverse engineering) terhadap perangkat
              lunak atau teknologi kami
            </li>
            <li className="mb-2">
              Menggunakan konten kami untuk tujuan komersial tanpa lisensi yang
              sesuai
            </li>
          </ul>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Tanggung Jawab Pengguna
          </h2>
          <p className="text-gray-700 mb-4">
            Sebagai pengguna layanan kami, Anda bertanggung jawab untuk:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Memberikan informasi yang akurat dan lengkap saat berinteraksi
              dengan kami
            </li>
            <li className="mb-2">
              Menjaga kerahasiaan kredensial akun Anda dan tidak membagikannya
              dengan pihak lain
            </li>
            <li className="mb-2">
              Tidak menggunakan layanan kami untuk tujuan ilegal atau yang
              melanggar hak pihak ketiga
            </li>
            <li className="mb-2">
              Memastikan bahwa konten atau material yang Anda berikan kepada
              kami tidak melanggar hak cipta, merek dagang, atau hak kekayaan
              intelektual lainnya
            </li>
            <li className="mb-2">
              Tidak melakukan tindakan yang dapat merusak, menonaktifkan, atau
              membebani infrastruktur layanan kami
            </li>
          </ul>
        </div>

        {/* Payment Terms */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Ketentuan Pembayaran
          </h2>
          <p className="text-gray-700 mb-4">
            Biaya untuk layanan kami akan diuraikan dalam proposal atau kontrak
            terpisah yang disepakati antara Oknum dan klien. Pembayaran harus
            dilakukan sesuai dengan jadwal yang disepakati dalam kontrak
            tersebut.
          </p>
          <p className="text-gray-700 mb-4">
            Kecuali dinyatakan lain, semua biaya bersifat non-refundable dan
            tidak termasuk pajak yang berlaku. Anda bertanggung jawab untuk
            membayar semua pajak yang terkait dengan layanan yang Anda terima.
          </p>
          <p className="text-gray-700 mb-4">
            Jika Anda gagal melakukan pembayaran tepat waktu, kami berhak untuk:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Mengenakan bunga keterlambatan sesuai dengan ketentuan dalam
              kontrak
            </li>
            <li className="mb-2">
              Menangguhkan atau menghentikan layanan sampai pembayaran diterima
            </li>
            <li className="mb-2">
              Menahan hasil pekerjaan atau aset digital yang dikembangkan
            </li>
            <li className="mb-2">
              Mengambil tindakan hukum untuk menagih jumlah yang terutang
            </li>
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Batasan Tanggung Jawab
          </h2>
          <p className="text-gray-700 mb-4">
            Sejauh diizinkan oleh hukum yang berlaku, Oknum dan afiliasinya
            tidak bertanggung jawab atas kerusakan tidak langsung, insidental,
            khusus, konsekuensial, atau punitif, termasuk namun tidak terbatas
            pada kehilangan keuntungan, kehilangan data, atau kerugian bisnis,
            yang timbul dari atau terkait dengan penggunaan Anda atas layanan
            kami.
          </p>
          <p className="text-gray-700 mb-4">
            Total tanggung jawab kami yang timbul dari atau terkait dengan
            layanan kami tidak akan melebihi jumlah yang telah Anda bayarkan
            kepada kami untuk layanan tersebut dalam periode enam (6) bulan
            sebelum klaim tanggung jawab muncul.
          </p>
          <p className="text-gray-700 mb-4">
            Beberapa yurisdiksi tidak mengizinkan pengecualian atau pembatasan
            tanggung jawab atas kerusakan konsekuensial atau insidental,
            sehingga pembatasan di atas mungkin tidak berlaku untuk Anda.
          </p>
        </div>

        {/* Indemnification */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Ganti Rugi</h2>
          <p className="text-gray-700 mb-4">
            Anda setuju untuk mengganti kerugian, membela, dan membebaskan
            Oknum, karyawan, direktur, afiliasi, dan mitra kami dari segala
            klaim, tuntutan, kerugian, kewajiban, dan biaya (termasuk biaya
            hukum) yang timbul dari atau terkait dengan:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">Penggunaan Anda atas layanan kami</li>
            <li className="mb-2">
              Pelanggaran Anda terhadap Syarat dan Ketentuan ini
            </li>
            <li className="mb-2">
              Pelanggaran Anda terhadap hak pihak ketiga, termasuk hak kekayaan
              intelektual
            </li>
            <li className="mb-2">
              Konten atau material yang Anda berikan kepada kami
            </li>
          </ul>
        </div>

        {/* Termination */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Penghentian</h2>
          <p className="text-gray-700 mb-4">
            Kami berhak untuk menangguhkan atau menghentikan akses Anda ke
            layanan kami kapan saja dan dengan alasan apa pun, termasuk jika
            kami secara wajar yakin bahwa:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Anda telah melanggar Syarat dan Ketentuan ini
            </li>
            <li className="mb-2">
              Anda terlibat dalam aktivitas yang melanggar hukum atau merugikan
            </li>
            <li className="mb-2">Anda gagal membayar biaya yang terutang</li>
            <li className="mb-2">
              Penggunaan Anda atas layanan kami menimbulkan risiko hukum bagi
              kami
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Penghentian kontrak dan layanan juga akan diatur oleh ketentuan yang
            disepakati dalam kontrak terpisah antara Oknum dan klien.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Hukum yang Berlaku
          </h2>
          <p className="text-gray-700 mb-4">
            Syarat dan Ketentuan ini akan diatur dan ditafsirkan sesuai dengan
            hukum Indonesia, tanpa memperhatikan konflik ketentuan hukum.
          </p>
          <p className="text-gray-700 mb-4">
            Setiap perselisihan yang timbul dari atau terkait dengan Syarat dan
            Ketentuan ini akan diselesaikan melalui negosiasi dengan itikad
            baik. Jika negosiasi tidak berhasil menyelesaikan perselisihan dalam
            waktu 30 (tiga puluh) hari, perselisihan tersebut akan diselesaikan
            melalui arbitrase sesuai dengan Peraturan Badan Arbitrase Nasional
            Indonesia (BANI).
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Perubahan Ketentuan
          </h2>
          <p className="text-gray-700 mb-4">
            Kami berhak untuk memodifikasi atau mengganti Syarat dan Ketentuan
            ini kapan saja, atas kebijakan kami sendiri. Kami akan memberi tahu
            Anda tentang perubahan material dengan memposting versi terbaru di
            situs web kami dan memperbarui tanggal "Terakhir diperbarui" di
            bagian atas.
          </p>
          <p className="text-gray-700 mb-4">
            Dengan terus mengakses atau menggunakan layanan kami setelah revisi
            tersebut efektif, Anda setuju untuk terikat oleh Syarat dan
            Ketentuan yang direvisi. Jika Anda tidak setuju dengan ketentuan
            baru, Anda tidak lagi diizinkan untuk menggunakan layanan kami.
          </p>
        </div>

        {/* Severability */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Keterpisahan
          </h2>
          <p className="text-gray-700 mb-4">
            Jika ada ketentuan dalam Syarat dan Ketentuan ini yang dianggap
            tidak sah, tidak berlaku, atau tidak dapat dilaksanakan, ketentuan
            tersebut akan dipisahkan dari ketentuan lainnya dan tidak akan
            memengaruhi validitas dan keberlakuan ketentuan lainnya.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
            silakan hubungi kami di:
          </p>
          <div className="pl-6 mb-4 text-gray-700">
            <p>
              <strong>Oknum</strong>
            </p>
            <p>Jl. Teknologi Digital No. 123</p>
            <p>Tangerang Selatan, Banten 15413</p>
            <p>Indonesia</p>
            <p>Email: legal@oknum.id</p>
            <p>Telepon: +62 812 3456 7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsView;
