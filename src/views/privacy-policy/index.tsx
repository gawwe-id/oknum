import React from "react";

const PrivacyPolicyView = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-2">
            Kebijakan Privasi
          </span>
          <h1 className={`text-gray-700 text-3xl md:text-4xl font-black mb-4`}>
            Privacy Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Terakhir diperbarui: 11 April 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Pendahuluan</h2>
          <p className="text-gray-700 mb-4">
            Oknum (&quot;Kami&quot;, &quot;Kita&quot;, atau &quot;Perusahaan
            kami&quot;) berkomitmen untuk melindungi privasi Anda. Kebijakan
            Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
            dan melindungi informasi pribadi Anda ketika Anda mengunjungi situs
            web kami atau menggunakan layanan kami.
          </p>
          <p className="text-gray-700 mb-4">
            Dengan menggunakan situs web atau layanan kami, Anda menyetujui
            praktik yang dijelaskan dalam Kebijakan Privasi ini. Kami dapat
            mengubah Kebijakan Privasi ini dari waktu ke waktu, sehingga kami
            mendorong Anda untuk meninjau halaman ini secara berkala.
          </p>
        </div>

        {/* Information Collection */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Informasi yang Kami Kumpulkan
          </h2>

          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Informasi yang Anda Berikan
          </h3>
          <p className="text-gray-700 mb-4">
            Kami mengumpulkan informasi pribadi yang Anda berikan secara
            langsung kepada kami, seperti saat Anda:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Mengisi formulir kontak atau pendaftaran di situs web kami
            </li>
            <li className="mb-2">
              Mendaftar untuk berlangganan newsletter kami
            </li>
            <li className="mb-2">
              Berkomunikasi dengan kami melalui email, telepon, atau saluran
              lainnya
            </li>
            <li className="mb-2">Memesan layanan atau produk kami</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Informasi yang kami kumpulkan dapat mencakup nama, alamat email,
            nomor telepon, alamat, dan informasi lain yang relevan dengan
            permintaan Anda.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Informasi yang Dikumpulkan Secara Otomatis
          </h3>
          <p className="text-gray-700 mb-4">
            Ketika Anda menggunakan situs web kami, kami mungkin mengumpulkan
            informasi tertentu secara otomatis, termasuk:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Informasi perangkat (seperti alamat IP, jenis perangkat, sistem
              operasi)
            </li>
            <li className="mb-2">
              Informasi penggunaan (seperti halaman yang dikunjungi, tautan yang
              diklik)
            </li>
            <li className="mb-2">Data cookie dan teknologi pelacakan serupa</li>
          </ul>
        </div>

        {/* Use of Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Bagaimana Kami Menggunakan Informasi Anda
          </h2>
          <p className="text-gray-700 mb-4">
            Kami menggunakan informasi yang kami kumpulkan untuk tujuan berikut:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Menyediakan, memelihara, dan meningkatkan layanan kami
            </li>
            <li className="mb-2">
              Memproses transaksi dan mengirimkan informasi terkait
            </li>
            <li className="mb-2">
              Mengirimkan pemberitahuan teknis, pembaruan, dan pesan
              administratif
            </li>
            <li className="mb-2">
              Merespons permintaan, pertanyaan, dan umpan balik Anda
            </li>
            <li className="mb-2">
              Memantau dan menganalisis tren, penggunaan, dan aktivitas
            </li>
            <li className="mb-2">
              Melindungi keamanan dan integritas layanan kami
            </li>
            <li className="mb-2">Mematuhi kewajiban hukum</li>
          </ul>
        </div>

        {/* Information Sharing */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Berbagi dan Pengungkapan Informasi
          </h2>
          <p className="text-gray-700 mb-4">
            Kami tidak menjual informasi pribadi Anda kepada pihak ketiga.
            Namun, kami mungkin membagikan informasi Anda dalam keadaan tertentu
            seperti:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Dengan penyedia layanan yang membantu kami mengoperasikan bisnis
            </li>
            <li className="mb-2">Dalam rangka mematuhi kewajiban hukum</li>
            <li className="mb-2">
              Untuk melindungi hak, properti, atau keselamatan kami atau orang
              lain
            </li>
            <li className="mb-2">
              Dalam kaitannya dengan penjualan, penggabungan, atau reorganisasi
              bisnis
            </li>
            <li className="mb-2">Dengan persetujuan Anda</li>
          </ul>
        </div>

        {/* Cookies */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Cookie dan Teknologi Pelacakan
          </h2>
          <p className="text-gray-700 mb-4">
            Kami dan pihak ketiga yang terafiliasi menggunakan cookie dan
            teknologi pelacakan serupa untuk mengumpulkan dan menggunakan
            informasi tentang Anda saat Anda menggunakan situs web kami. Cookie
            adalah file kecil yang disimpan di perangkat Anda yang memungkinkan
            kami mengenali dan mengingat Anda.
          </p>
          <p className="text-gray-700 mb-4">Kami menggunakan cookie untuk:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Menyediakan fungsionalitas dan konten yang dipersonalisasi
            </li>
            <li className="mb-2">
              Memahami bagaimana Anda menggunakan situs kami
            </li>
            <li className="mb-2">Meningkatkan performa situs web</li>
            <li className="mb-2">Memberikan pengalaman yang lebih relevan</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Anda dapat mengatur browser Anda untuk menolak semua atau beberapa
            cookie, atau memberi tahu Anda ketika cookie dikirim. Namun,
            beberapa fitur situs web mungkin tidak berfunsi dengan baik tanpa
            cookie.
          </p>
        </div>

        {/* User Rights */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Hak Anda</h2>
          <p className="text-gray-700 mb-4">
            Tergantung pada lokasi Anda, Anda mungkin memiliki hak tertentu
            terkait dengan informasi pribadi Anda, termasuk:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Hak untuk mengakses informasi yang kami simpan tentang Anda
            </li>
            <li className="mb-2">
              Hak untuk meminta koreksi atau pembaruan informasi Anda
            </li>
            <li className="mb-2">
              Hak untuk meminta penghapusan informasi Anda
            </li>
            <li className="mb-2">
              Hak untuk menolak atau membatasi pemrosesan data Anda
            </li>
            <li className="mb-2">Hak untuk data portabilitas</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Untuk mengajukan permintaan terkait dengan hak Anda, silakan hubungi
            kami menggunakan informasi kontak yang tercantum di bagian
            &quot;Hubungi Kami&quot;.
          </p>
        </div>

        {/* Data Security */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Keamanan Data
          </h2>
          <p className="text-gray-700 mb-4">
            Kami mengimplementasikan langkah-langkah keamanan yang dirancang
            untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau
            pengungkapan yang tidak sah. Namun, tidak ada metode transmisi
            internet atau penyimpanan elektronik yang 100% aman. Oleh karena
            itu, meskipun kami berusaha menggunakan cara yang dapat diterima
            secara komersial untuk melindungi informasi pribadi Anda, kami tidak
            dapat menjamin keamanan absolutnya.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Privasi Anak-anak
          </h2>
          <p className="text-gray-700 mb-4">
            Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun.
            Kami tidak dengan sengaja mengumpulkan informasi pribadi dari
            anak-anak di bawah 13 tahun. Jika Anda adalah orang tua atau wali
            dan percaya bahwa anak Anda telah memberikan kami informasi pribadi,
            silakan hubungi kami agar kami dapat mengambil tindakan yang tepat.
          </p>
        </div>

        {/* Policy Changes */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Perubahan Kebijakan Privasi
          </h2>
          <p className="text-gray-700 mb-4">
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu
            untuk mencerminkan perubahan dalam praktik kami atau untuk alasan
            operasional, hukum, atau peraturan lainnya. Kami akan memberi tahu
            Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi
            yang baru di halaman ini dan memperbarui tanggal &quot;Terakhir
            diperbarui&quot; di bagian atas.
          </p>
          <p className="text-gray-700 mb-4">
            Kami mendorong Anda untuk meninjau Kebijakan Privasi ini secara
            berkala untuk tetap mendapatkan informasi terbaru tentang bagaimana
            kami melindungi informasi pribadi Anda.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan
            Privasi ini atau praktik privasi kami, silakan hubungi kami di:
          </p>
          <div className="pl-6 mb-4 text-gray-700">
            <p>
              <strong>Oknum</strong>
            </p>
            <p>Jl. Lamtoro, Pamulang Barat</p>
            <p>Tangerang Selatan, Banten 15418</p>
            <p>Indonesia</p>
            <p>Email: privacy@oknum.studio</p>
            <p>Telepon: +62 812 822 7597</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
