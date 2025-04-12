"use client"
import ServiceCalculator from "./service-calculator"

export default function Calculator() {
  return (
    <section id="calculator" className="section-padding">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-primary">Kalkulator Estimasi Biaya</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Hitung estimasi biaya pembuatan kubah masjid sesuai dengan kebutuhan Anda.
          </p>
        </div>

        <ServiceCalculator serviceType="kubah-masjid" />
      </div>
    </section>
  )
}
