import React from "react";
import { reggae } from "@/app/fonts";

const RefundPolicyView = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-2">
            Kebijakan Pengembalian Dana
          </span>
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${reggae.className}`}
          >
            Refund Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Terakhir diperbarui: 11 April 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Pendahuluan</h2>
          <p className="text-gray-700 mb-4">
            Oknum ("Kami") berkomitmen untuk memberikan layanan berkualitas
            tinggi dan kepuasan pelanggan. Kebijakan Pengembalian Dana ini
            menjelaskan prosedur, syarat, dan ketentuan terkait pengembalian
            dana untuk layanan yang kami sediakan.
          </p>
          <p className="text-gray-700 mb-4">
            Dengan menggunakan layanan kami, Anda menyetujui Kebijakan
            Pengembalian Dana ini. Kami menyarankan Anda untuk membaca dokumen
            ini dengan seksama dan memahami hak dan kewajiban Anda sebelum
            memesan layanan kami.
          </p>
        </div>

        {/* General Provisions */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Ketentuan Umum
          </h2>
          <p className="text-gray-700 mb-4">
            Karena sifat khusus dari layanan digital yang kami tawarkan, Oknum
            mengikuti kebijakan pengembalian dana yang ketat sesuai dengan
            praktik industri standar. Sebagai pembuat produk digital khusus,
            setiap proyek kami dirancang secara spesifik untuk kebutuhan klien
            dan melibatkan waktu, sumber daya, dan keahlian yang substansial.
          </p>
          <p className="text-gray-700 mb-4">
            Secara umum, pengembalian dana dapat diberikan dalam situasi
            berikut:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Kami gagal memulai proyek dalam jangka waktu yang disepakati
            </li>
            <li className="mb-2">
              Kami tidak dapat menyediakan layanan yang secara spesifik telah
              disepakati dalam kontrak
            </li>
            <li className="mb-2">
              Terjadi kesalahan penagihan atau duplikasi pembayaran
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Semua permintaan pengembalian dana akan dinilai berdasarkan kasus
            per kasus, dengan mempertimbangkan sifat proyek, tahap penyelesaian,
            dan ketentuan khusus dalam kontrak.
          </p>
        </div>

        {/* Refund Eligibility */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Kelayakan Pengembalian Dana
          </h2>

          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Pembayaran Deposit atau Uang Muka
          </h3>
          <p className="text-gray-700 mb-4">
            Sesuai dengan praktik standar industri, pembayaran deposit atau uang
            muka umumnya bersifat non-refundable. Deposit digunakan untuk
            mengalokasikan sumber daya, merencanakan proyek, dan mempersiapkan
            timeline pengembangan.
          </p>
          <p className="text-gray-700 mb-4">
            Namun, pengembalian dana untuk deposit dapat dipertimbangkan dalam
            keadaan berikut:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Jika Oknum gagal memulai proyek dalam 30 hari dari tanggal yang
              disepakati tanpa alasan yang dapat diterima
            </li>
            <li className="mb-2">
              Jika Oknum menyatakan bahwa mereka tidak dapat melakukan proyek
              sebelum pekerjaan dimulai
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Dalam kasus tersebut, kami dapat mengembalikan hingga 50% dari
            deposit, dengan pengurangan untuk biaya administratif, persiapan
            proyek, dan sumber daya yang telah dialokasikan.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-700">
            Proyek yang Sedang Berlangsung
          </h3>
          <p className="text-gray-700 mb-4">
            Untuk proyek yang sudah dimulai dan dalam proses pengembangan:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Pengembalian dana biasanya tidak tersedia untuk pekerjaan yang
              telah dilakukan
            </li>
            <li className="mb-2">
              Jika proyek dibatalkan oleh klien, pembayaran yang telah dilakukan
              untuk pekerjaan yang sudah diselesaikan tidak dapat dikembalikan
            </li>
            <li className="mb-2">
              Jika Oknum tidak dapat melanjutkan proyek karena alasan di luar
              kendali, pengembalian dana pro-rata dapat dipertimbangkan untuk
              bagian pekerjaan yang belum dilakukan
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-700">
            Layanan Pemeliharaan dan Berlangganan
          </h3>
          <p className="text-gray-700 mb-4">
            Untuk layanan pemeliharaan atau berlangganan:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Pembayaran untuk periode berlangganan yang belum digunakan dapat
              dikembalikan secara pro-rata jika permintaan pembatalan diterima
              minimal 14 hari sebelum tanggal pembaruan
            </li>
            <li className="mb-2">
              Biaya pengaturan atau biaya inisiasi tidak dapat dikembalikan
            </li>
            <li className="mb-2">
              Pembatalan yang diajukan kurang dari 14 hari sebelum tanggal
              pembaruan mungkin tidak memenuhi syarat untuk pengembalian dana
            </li>
          </ul>
        </div>

        {/* Non-refundable Services */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Layanan yang Tidak Dapat Dikembalikan
          </h2>
          <p className="text-gray-700 mb-4">
            Beberapa jenis layanan secara khusus tidak memenuhi syarat untuk
            pengembalian dana, termasuk:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Konsultasi, sesi perencanaan, dan layanan advisory
            </li>
            <li className="mb-2">
              Lisensi perangkat lunak atau produk digital yang telah dikirimkan
            </li>
            <li className="mb-2">
              Layanan kustomisasi setelah produk digital utama telah dikirimkan
              dan diterima
            </li>
            <li className="mb-2">
              Biaya domain, hosting, atau layanan pihak ketiga yang telah dibeli
              atas nama klien
            </li>
            <li className="mb-2">
              Layanan pelatihan atau workshop yang telah dilaksanakan
            </li>
            <li className="mb-2">
              Pekerjaan desain yang telah diselesaikan dan dikirimkan
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Untuk layanan-layanan tersebut, kami dapat menawarkan kredit untuk
            layanan di masa mendatang sebagai pengganti pengembalian dana,
            berdasarkan evaluasi kasus per kasus.
          </p>
        </div>

        {/* Refund Process */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Proses Pengembalian Dana
          </h2>
          <p className="text-gray-700 mb-4">
            Jika Anda ingin mengajukan pengembalian dana, silakan ikuti proses
            berikut:
          </p>
          <ol className="list-decimal pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              <strong>Pengajuan Permintaan:</strong> Kirimkan permintaan
              pengembalian dana secara tertulis melalui email ke
              finance@oknum.studio dengan subjek "Permintaan Pengembalian Dana -
              [Nama Proyek]"
            </li>
            <li className="mb-2">
              <strong>Informasi yang Diperlukan:</strong> Sertakan informasi
              berikut dalam permintaan Anda:
              <ul className="list-disc pl-6 mt-2">
                <li>Nama dan informasi kontak Anda</li>
                <li>Nomor invoice atau referensi proyek</li>
                <li>Tanggal pembayaran</li>
                <li>Jumlah yang dibayarkan</li>
                <li>Metode pembayaran yang digunakan</li>
                <li>Alasan permintaan pengembalian dana</li>
                <li>Dokumentasi pendukung (jika ada)</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Evaluasi:</strong> Tim kami akan meninjau permintaan Anda
              dalam waktu 5 hari kerja dan mungkin menghubungi Anda untuk
              informasi tambahan jika diperlukan
            </li>
            <li className="mb-2">
              <strong>Keputusan:</strong> Anda akan diberitahu tentang keputusan
              kami secara tertulis, termasuk alasan jika permintaan ditolak
            </li>
            <li className="mb-2">
              <strong>Pemrosesan:</strong> Jika disetujui, pengembalian dana
              akan diproses dalam waktu 10-15 hari kerja menggunakan metode
              pembayaran asli bila memungkinkan
            </li>
          </ol>
          <p className="text-gray-700 mb-4">
            Harap dicatat bahwa biaya transaksi, biaya transfer, atau biaya
            perbankan yang terkait dengan pengembalian dana mungkin dikurangkan
            dari jumlah pengembalian.
          </p>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Kebijakan Pembatalan
          </h2>
          <p className="text-gray-700 mb-4">
            Pembatalan proyek atau layanan tunduk pada ketentuan berikut:
          </p>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Pembatalan oleh Klien
          </h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              <strong>Sebelum Dimulai:</strong> Jika Anda membatalkan proyek
              sebelum pekerjaan dimulai, deposit dapat dikenakan biaya
              pembatalan hingga 50% tergantung pada persiapan yang telah
              dilakukan
            </li>
            <li className="mb-2">
              <strong>Selama Pengembangan:</strong> Jika Anda membatalkan selama
              fase pengembangan, Anda bertanggung jawab untuk membayar semua
              pekerjaan yang telah diselesaikan hingga titik pembatalan
            </li>
            <li className="mb-2">
              <strong>Tahap Akhir:</strong> Pembatalan pada tahap akhir proyek
              (75% atau lebih selesai) biasanya mengharuskan pembayaran penuh
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-700">
            Pembatalan oleh Oknum
          </h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              <strong>Sebelum Dimulai:</strong> Jika kami membatalkan proyek
              sebelum dimulai, kami akan mengembalikan deposit penuh
            </li>
            <li className="mb-2">
              <strong>Selama Pengembangan:</strong> Jika kami perlu membatalkan
              selama pengembangan karena alasan di luar kendali kami, kami akan
              mengembalikan dana secara pro-rata untuk pekerjaan yang belum
              diselesaikan
            </li>
            <li className="mb-2">
              <strong>Masalah Etis atau Hukum:</strong> Kami berhak membatalkan
              proyek tanpa pengembalian dana jika kami menemukan bahwa proyek
              melibatkan aktivitas ilegal atau tidak etis
            </li>
          </ul>

          <p className="text-gray-700 mb-4">
            Semua pembatalan harus disampaikan secara tertulis dan akan berlaku
            setelah konfirmasi penerimaan.
          </p>
        </div>

        {/* Special Circumstances */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Keadaan Khusus
          </h2>
          <p className="text-gray-700 mb-4">
            Kami memahami bahwa situasi luar biasa dapat terjadi. Oleh karena
            itu, kami dapat membuat pengecualian terhadap kebijakan ini dalam
            keadaan berikut:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Bencana alam atau keadaan darurat yang memengaruhi salah satu
              pihak
            </li>
            <li className="mb-2">
              Masalah kesehatan serius dengan dokumentasi medis yang memadai
            </li>
            <li className="mb-2">
              Perubahan signifikan dalam peraturan atau hukum yang memengaruhi
              proyek
            </li>
            <li className="mb-2">
              Kegagalan sistem teknologi yang tidak dapat diperbaiki di luar
              kendali kedua belah pihak
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            Dalam situasi tersebut, kami akan bekerja sama dengan Anda untuk
            menemukan solusi yang adil, yang mungkin termasuk pengembalian dana
            parsial, penjadwalan ulang proyek, atau alternatif lain yang
            disepakati bersama.
          </p>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Penyelesaian Sengketa
          </h2>
          <p className="text-gray-700 mb-4">
            Jika terjadi perselisihan terkait pengembalian dana:
          </p>
          <ol className="list-decimal pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Kami akan berusaha menyelesaikan masalah secara internal terlebih
              dahulu melalui komunikasi terbuka
            </li>
            <li className="mb-2">
              Jika masalah tidak dapat diselesaikan, kedua belah pihak setuju
              untuk menempuh mediasi sebelum mengambil tindakan hukum formal
            </li>
            <li className="mb-2">
              Mediasi akan dilakukan oleh mediator yang disepakati bersama di
              Tangerang Selatan, Indonesia
            </li>
            <li className="mb-2">
              Jika mediasi gagal, sengketa akan diselesaikan sesuai dengan
              klausul penyelesaian sengketa dalam Syarat dan Ketentuan kami
            </li>
          </ol>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Perubahan Kebijakan
          </h2>
          <p className="text-gray-700 mb-4">
            Oknum berhak untuk mengubah atau memperbarui Kebijakan Pengembalian
            Dana ini kapan saja atas kebijakan kami sendiri. Perubahan akan
            berlaku setelah dipublikasikan di situs web kami dengan tanggal
            "Terakhir diperbarui" yang direvisi.
          </p>
          <p className="text-gray-700 mb-4">
            Perubahan kebijakan tidak akan berlaku surut untuk transaksi yang
            terjadi sebelum tanggal perubahan. Transaksi yang ada akan diatur
            oleh kebijakan yang berlaku pada saat transaksi.
          </p>
          <p className="text-gray-700 mb-4">
            Kami mendorong Anda untuk meninjau Kebijakan Pengembalian Dana ini
            secara berkala untuk mengetahui pembaruan atau perubahan.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan tentang Kebijakan Pengembalian Dana
            ini atau ingin mengajukan permintaan pengembalian dana, silakan
            hubungi tim keuangan kami di:
          </p>
          <div className="pl-6 mb-4 text-gray-700">
            <p>
              <strong>Oknum - Departemen Keuangan</strong>
            </p>
            <p>Jl. Teknologi Digital No. 123</p>
            <p>Tangerang Selatan, Banten 15413</p>
            <p>Indonesia</p>
            <p>Email: finance@oknum.studio</p>
            <p>Telepon: +62 812 3456 7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyView;
