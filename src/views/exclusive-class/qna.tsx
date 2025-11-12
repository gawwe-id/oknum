'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface QnAItem {
  question: string;
  answer: string;
}

const qnaData: QnAItem[] = [
  {
    question: 'Bagaimana cara mendaftar untuk kelas eksklusif?',
    answer:
      'Anda dapat mendaftar dengan memilih kelas yang tersedia di halaman ini, kemudian klik tombol "Daftar Sekarang" atau "Enroll". Setelah itu, Anda akan diarahkan ke halaman pembayaran untuk menyelesaikan pendaftaran. Pastikan Anda sudah memiliki akun dan sudah login terlebih dahulu.'
  },
  {
    question: 'Apa saja metode pembayaran yang tersedia?',
    answer:
      'Kami menerima berbagai metode pembayaran melalui Duitku, termasuk transfer bank, e-wallet (OVO, DANA, GoPay, LinkAja), dan kartu kredit/debit. Semua transaksi dilakukan dengan aman dan terenkripsi.'
  },
  {
    question: 'Siapa yang mengajar kelas-kelas ini?',
    answer:
      'Semua kelas diajar oleh expert berpengalaman yang telah terverifikasi oleh Oknum Studio. Setiap expert memiliki latar belakang profesional yang kuat di bidangnya masing-masing dan telah melalui proses seleksi untuk memastikan kualitas pengajaran yang terbaik.'
  },
  {
    question: 'Apakah ada prasyarat untuk mengikuti kelas?',
    answer:
      'Beberapa kelas mungkin memiliki prasyarat tertentu yang akan disebutkan di deskripsi kelas. Namun, sebagian besar kelas dirancang untuk berbagai tingkat keahlian, mulai dari pemula hingga tingkat lanjut. Pastikan untuk membaca deskripsi kelas dengan teliti sebelum mendaftar.'
  },
  {
    question:
      'Bagaimana kebijakan refund jika saya tidak bisa mengikuti kelas?',
    answer:
      'Kebijakan refund mengikuti ketentuan yang berlaku di halaman Kebijakan Pengembalian Dana kami. Umumnya, refund dapat dilakukan dalam batas waktu tertentu sebelum kelas dimulai. Silakan hubungi tim support kami untuk informasi lebih lanjut mengenai refund.'
  },
  {
    question: 'Berapa jumlah maksimal peserta dalam satu kelas?',
    answer:
      'Jumlah maksimal peserta bervariasi tergantung jenis kelas dan kapasitas yang ditetapkan oleh expert. Informasi ini akan terlihat di halaman detail kelas. Kami membatasi jumlah peserta untuk memastikan kualitas pembelajaran dan interaksi yang optimal.'
  },
  {
    question: 'Bagaimana jadwal kelas ditentukan?',
    answer:
      'Jadwal kelas ditentukan oleh expert dan akan terlihat di halaman detail kelas. Beberapa kelas memiliki jadwal tetap, sementara yang lain mungkin fleksibel. Anda dapat melihat semua jadwal yang tersedia sebelum melakukan pendaftaran.'
  },
  {
    question: 'Apakah saya bisa mengakses rekaman kelas setelah selesai?',
    answer:
      'Untuk kelas online dan hybrid, rekaman sesi biasanya tersedia untuk diakses kembali dalam periode tertentu setelah kelas selesai. Durasi akses ini bervariasi tergantung kebijakan masing-masing kelas dan akan diinformasikan di halaman detail kelas.'
  },
  {
    question: 'Bagaimana cara menghubungi support jika ada pertanyaan?',
    answer:
      'Anda dapat menghubungi tim support kami melalui halaman Contact Us atau melalui email yang tertera di website. Kami siap membantu menjawab pertanyaan Anda terkait kelas, pendaftaran, pembayaran, atau hal lainnya.'
  }
];

export default function QnA() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <HelpCircle className="size-8 text-emerald-600 mr-2" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Pertanyaan Umum
            </h2>
          </div>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang kelas
            eksklusif dan premium experiences kami
          </p>
        </motion.div>

        {/* Q&A List */}
        <div className="space-y-4">
          {qnaData.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset rounded-xl"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="size-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-600 mb-4">
            Masih ada pertanyaan? Jangan ragu untuk menghubungi kami
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Hubungi Kami
          </a>
        </motion.div>
      </div>
    </section>
  );
}
