import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, Phone } from "lucide-react";
import Link from "next/link";

const NotFoundContent: React.FC = () => {
  return (
    <div className="py-36 flex items-center justify-center mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* 404 Illustration */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md h-72">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-emerald-200"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-dashed border-emerald-300"></div>
            </div>

            {/* 404 Numbers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 flex items-center">
                4
                <div className="mx-2 relative">
                  <AlertTriangle className="w-24 h-24 text-orange-500" />
                </div>
                4
              </div>
            </div>
          </div>
        </div>

        {/* 404 Message */}
        <div className="text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-4">
            404 Not Found
          </div>

          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-md text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
            dipindahkan. Silakan kembali ke halaman utama atau gunakan navigasi
            untuk menemukan halaman yang Anda cari.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center md:justify-start">
            <Link href="/" passHref>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 gap-2">
                <Home className="w-5 h-5" />
                Kembali ke Beranda
              </Button>
            </Link>

            <Link href="/contact" passHref>
              <Button
                variant="outline"
                className="border-gray-300 text-emerald-600 hover:text-emerald-500 px-6 flex items-center gap-1"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundContent;
