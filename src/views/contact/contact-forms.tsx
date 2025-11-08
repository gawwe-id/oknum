"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const ContactForms = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [state, handleSubmit] = useForm("mkgjklkj");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // WhatsApp redirect function
  const redirectToWhatsApp = () => {
    // Replace with your actual WhatsApp number (international format without +)
    const phoneNumber = "6281218227597";
    const message = encodeURIComponent(
      "Halo, saya ingin bertanya tentang layanan Oknum."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Information */}
      <motion.div
        className="lg:col-span-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        variants={itemVariants}
      >
        <div className="mb-8">
          <h2 className={`text-2xl font-black mb-6 text-gray-800`}>
            Oknum Studio
          </h2>
          <p className="text-gray-600 mb-6">
            Tim kami siap membantu menjawab pertanyaan Anda dan menyediakan
            informasi yang Anda butuhkan.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Telepon
              </h3>
              <p className="text-gray-600">+62 812 3456 7890</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Email
              </h3>
              <p className="text-gray-600">info@oknum.studio</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Alamat
              </h3>
              <p className="text-gray-600">
                Jl. Teknologi Digital No. 123
                <br />
                Tangerang Selatan, Banten 15413
                <br />
                Indonesia
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Hubungi Langsung via WhatsApp
          </h3>
          <Button
            onClick={redirectToWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 py-6"
          >
            <svg
              fill="#fff"
              width="24px"
              height="24px"
              viewBox="-2 -2 24 24"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin"
              className="mr-1"
            >
              <path d="M9.516.012C4.206.262.017 4.652.033 9.929a9.798 9.798 0 0 0 1.085 4.465L.06 19.495a.387.387 0 0 0 .47.453l5.034-1.184a9.981 9.981 0 0 0 4.284 1.032c5.427.083 9.951-4.195 10.12-9.58C20.15 4.441 15.351-.265 9.516.011zm6.007 15.367a7.784 7.784 0 0 1-5.52 2.27 7.77 7.77 0 0 1-3.474-.808l-.701-.347-3.087.726.65-3.131-.346-.672A7.62 7.62 0 0 1 2.197 9.9c0-2.07.812-4.017 2.286-5.48a7.85 7.85 0 0 1 5.52-2.271c2.086 0 4.046.806 5.52 2.27a7.672 7.672 0 0 1 2.287 5.48c0 2.052-.825 4.03-2.287 5.481z" />
              <path d="M14.842 12.045l-1.931-.55a.723.723 0 0 0-.713.186l-.472.478a.707.707 0 0 1-.765.16c-.913-.367-2.835-2.063-3.326-2.912a.694.694 0 0 1 .056-.774l.412-.53a.71.71 0 0 0 .089-.726L7.38 5.553a.723.723 0 0 0-1.125-.256c-.539.453-1.179 1.14-1.256 1.903-.137 1.343.443 3.036 2.637 5.07 2.535 2.349 4.566 2.66 5.887 2.341.75-.18 1.35-.903 1.727-1.494a.713.713 0 0 0-.408-1.072z" />
            </svg>
            Chat via WhatsApp
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Respons cepat, biasanya dalam 1-2 jam di jam kerja
          </p>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Kirim Pesan</h2>

        {state.succeeded ? (
          <motion.div
            className="bg-green-50 p-6 rounded-lg border border-green-200 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="text-green-600 w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Terima Kasih!
            </h3>
            <p className="text-green-700 mb-4">
              Pesan Anda telah berhasil terkirim. Tim kami akan segera
              menghubungi Anda.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 outline-none transition-colors"
                  placeholder="Masukkan nama lengkap Anda"
                />
                <ValidationError
                  prefix="Name"
                  field="name"
                  errors={state.errors}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 outline-none transition-colors"
                  placeholder="email@anda.com"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 outline-none transition-colors"
                  placeholder="+62 xxx xxxx xxxx"
                />
                <ValidationError
                  prefix="Phone"
                  field="phone"
                  errors={state.errors}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subjek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 outline-none transition-colors"
                  placeholder="Konsultasi Project / Pertanyaan / dll"
                />
                <ValidationError
                  prefix="Subject"
                  field="subject"
                  errors={state.errors}
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pesan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 outline-none transition-colors resize-none"
                placeholder="Tulis pesan Anda disini..."
              ></textarea>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </div>

            {state.errors && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                <AlertCircle className="text-red-500 w-5 h-5 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">
                    Terjadi Kesalahan
                  </h4>
                  <p className="text-sm text-red-700">
                    Mohon maaf, terjadi kesalahan saat mengirim pesan. Silakan
                    coba lagi atau hubungi kami melalui WhatsApp.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Menandakan kolom wajib
                diisi
              </p>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                disabled={state.submitting}
              >
                {state.submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Pesan
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Dengan mengirimkan formulir ini, Anda menyetujui kebijakan privasi
              kami. Kami berkomitmen untuk melindungi data Anda.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ContactForms;
