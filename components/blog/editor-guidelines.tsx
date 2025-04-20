import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function EditorGuidelines() {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertCircle className="h-5 w-5 text-blue-600" />
      <AlertTitle className="text-blue-800">Panduan Penulisan Artikel SEO-Friendly</AlertTitle>
      <AlertDescription className="text-blue-700">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900 hover:no-underline py-2">
              Struktur Artikel yang Baik
            </AccordionTrigger>
            <AccordionContent className="text-blue-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Gunakan H1 untuk judul utama artikel (hanya satu H1 per artikel)</li>
                <li>Gunakan H2 untuk subjudul utama</li>
                <li>Gunakan paragraf pendek (3-4 kalimat) untuk keterbacaan yang lebih baik</li>
                <li>Sertakan gambar pendukung dengan alt text yang relevan</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900 hover:no-underline py-2">
              Optimasi Kata Kunci
            </AccordionTrigger>
            <AccordionContent className="text-blue-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Sertakan kata kunci utama di judul, subjudul pertama, dan paragraf awal</li>
                <li>Gunakan variasi kata kunci secara alami dalam konten</li>
                <li>Hindari keyword stuffing (penumpukan kata kunci)</li>
                <li>Gunakan kata kunci dalam alt text gambar</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900 hover:no-underline py-2">
              Tips Keterbacaan
            </AccordionTrigger>
            <AccordionContent className="text-blue-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Gunakan kalimat aktif dan langsung</li>
                <li>Hindari jargon teknis yang berlebihan</li>
                <li>Gunakan bullet points untuk informasi yang mudah dicerna</li>
                <li>Sertakan subheading setiap 300-350 kata</li>
                <li>Gunakan transisi antar paragraf untuk alur yang lebih baik</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-start mt-3 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <p>
            Editor TipTap membantu Anda membuat konten yang terstruktur dengan baik dan SEO-friendly. Gunakan toolbar
            untuk memformat teks dan tab Preview untuk melihat tampilan akhir artikel.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
