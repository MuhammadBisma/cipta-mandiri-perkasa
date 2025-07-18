"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculatorIcon, InfoIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Material = {
  name: string
  price: number
  description?: string
}

type AdditionalOption = {
  id: string
  name: string
  price: number
  description?: string
}

type SizeOption = {
  value: string
  label: string
}

type CalculatorData = {
  title: string
  description: string
  materials: Record<string, Material>
  sizeLabel: string
  sizeMultiplier: number
  minSize: number
  maxSize: number
  additionalOptions?: AdditionalOption[]
  catatan: string[]
  sizeOptions?: SizeOption[]
}

type PriceData = {
  "masjid": CalculatorData
  "kubah": CalculatorData
  "mimbar": CalculatorData
  "menara": CalculatorData
  "kerawangan": CalculatorData
  "kaligrafi": CalculatorData
  "ornamen": CalculatorData
}

type ServiceCalculatorProps = {
  serviceType: keyof PriceData
}

export type ServiceType = keyof PriceData

const priceData: PriceData = {
  masjid: {
    title: "Kalkulator Biaya Pembangunan Masjid",
    description: "Masukkan spesifikasi masjid untuk mendapatkan estimasi biaya",
    materials: {
      standard: { name: "Standard", price: 3500000 },
      premium: { name: "Premium", price: 5000000 },
      luxury: { name: "Luxury", price: 7500000 },
    },
    sizeLabel: "Luas Bangunan (m²)",
    sizeMultiplier: 1,
    minSize: 100,
    maxSize: 1000,
    additionalOptions: [
      { id: "kubah", name: "Kubah Masjid", price: 25000000 },
      { id: "menara", name: "Menara Masjid", price: 35000000 },
      { id: "interior", name: "Interior Premium", price: 15000000 },
    ],
    catatan: [
      "Harga termasuk pondasi, struktur bangunan, dan utilitas dasar",
      "Biaya tanah, izin bangunan, dan pengurusan dokumen tidak termasuk",
      "Luxury package termasuk AC sentral dan sistem audio profesional",
      "Garansi struktur 10 tahun untuk material premium",
      "Waktu pengerjaan: Standard (6-8 bulan), Premium (8-10 bulan), Luxury (10-12 bulan)"
    ]
  },
  kubah: {
    title: "Kalkulator Biaya Kubah Masjid",
    description: "Masukkan diameter dan tinggi kubah untuk mendapatkan estimasi biaya",
    materials: {
      luar: { name: "Kubah Luar", price: 850000 },
      dalam: { name: "Kubah Dalam", price: 750000 },
    },
    sizeLabel: "Diameter Kubah (meter)",
    sizeMultiplier: 1,
    minSize: 3,
    maxSize: 25,
    catatan: [
      "Harga sudah termasuk rangka baja galvanis",
      "Pemasangan membutuhkan crane untuk diameter >10m",
      "Terima pembayaran: 50% di awal, 30% progres, 20% finishing"
    ]
  },
  mimbar: {
    title: "Kalkulator Biaya Mimbar Masjid",
    description: "Masukkan spesifikasi mimbar untuk mendapatkan estimasi biaya",
    materials: {
      jati: { name: "Kayu Jati", price: 8000000 },
      mahoni: { name: "Kayu Mahoni", price: 5000000 },
      sonokeling: { name: "Kayu Sonokeling", price: 7000000 },
    },
    sizeLabel: "Ukuran Mimbar (meter)",
    sizeMultiplier: 1,
    minSize: 1,
    maxSize: 3,
    sizeOptions: [
      { value: "1", label: "Kecil (1.2m x 0.6m)" },
      { value: "2", label: "Sedang (1.5m x 0.8m)" },
      { value: "3", label: "Besar (2m x 1m)" },
    ],
    additionalOptions: [
      { id: "ukiran", name: "Ukiran Handmade", price: 3000000 },
      { id: "sound", name: "Sistem Sound", price: 5000000 },
    ],
    catatan: [
      "Kayu jati termasuk treatment anti rayap",
      "Ukiran handmade membutuhkan waktu tambahan 2-3 minggu",
      "Garansi 5 tahun untuk material kayu"
    ]
  },
  menara: {
    title: "Kalkulator Biaya Menara Masjid",
    description: "Masukkan spesifikasi menara untuk mendapatkan estimasi biaya",
    materials: {
      beton: { name: "Beton", price: 15000000 },
      baja: { name: "Baja", price: 20000000 },
      komposit: { name: "Komposit", price: 25000000 },
    },
    sizeLabel: "Tinggi Menara (meter)",
    sizeMultiplier: 1.2,
    minSize: 5,
    maxSize: 50,
    additionalOptions: [
      { id: "lighting", name: "Lighting System", price: 10000000 },
      { id: "speaker", name: "Speaker System", price: 15000000 },
    ],
    catatan: [
      "Material komposit tahan gempa hingga 8 SR",
      "Tinggi >30m memerlukan izin khusus",
      "Pemasangan sistem lighting termasuk maintenance 1 tahun"
    ]
  },
  kerawangan: {
    title: "Kalkulator Biaya Kerawangan",
    description: "Masukkan spesifikasi kerawangan untuk mendapatkan estimasi biaya",
    materials: {
      grc: { name: "GRC", price: 1500000 },
      aluminium: { name: "Aluminium", price: 2500000 },
      kuningan: { name: "Kuningan", price: 3500000 },
    },
    sizeLabel: "Luas Kerawangan (m²)",
    sizeMultiplier: 1,
    minSize: 1,
    maxSize: 100,
    catatan: [
      "GRC cocok untuk interior dengan budget terbatas",
      "Kuningan membutuhkan perawatan khusus setiap 6 bulan",
      "Harga termasuk instalasi untuk area <10m²"
    ]
  },
  kaligrafi: {
    title: "Kalkulator Biaya Kaligrafi",
    description: "Masukkan spesifikasi kaligrafi untuk mendapatkan estimasi biaya",
    materials: {
      kuningan: { name: "Kuningan", price: 3000000 },
      aluminium: { name: "Aluminium", price: 2000000 },
      akrilik: { name: "Akrilik", price: 1500000 },
    },
    sizeLabel: "Ukuran Kaligrafi (meter)",
    sizeMultiplier: 1.5,
    minSize: 1,
    maxSize: 15,
    additionalOptions: [
      { id: "lighting", name: "LED System", price: 5000000 },
      { id: "gold", name: "Gold Plating", price: 8000000 },
    ],
    catatan: [
      "Kaligrafi kuningan termasuk polishing setiap 3 tahun",
      "LED system bisa diatur via smartphone",
      "Gold plating menggunakan emas 24 karat"
    ]
  },
  ornamen: {
    title: "Kalkulator Biaya Ornamen Masjid",
    description: "Estimasi biaya ornamen dekoratif interior/eksterior",
    materials: {
      gypsum: { name: "Gypsum", price: 1200000 },
      fiber: { name: "Fiberglass", price: 2500000 },
      kayu: { name: "Kayu Ukir", price: 4500000 },
      kuningan: { name: "Kuningan", price: 6000000 },
    },
    sizeLabel: "Luas Ornamen (m²)",
    sizeMultiplier: 1,
    minSize: 0.5,
    maxSize: 50,
    additionalOptions: [
      { id: "gold", name: "Gold Leaf", price: 3500000 },
      { id: "3d", name: "Efek 3D", price: 5000000 },
    ],
    catatan: [
      "Ornamen kayu termasuk 3 lapis clear coat",
      "Fiberglass tahan cuaca untuk eksterior",
      "Gold leaf menggunakan emas 22 karat",
      "Waktu pengerjaan 2-4 minggu per m²"
    ]
  }
}

export default function ServiceCalculator({ serviceType }: ServiceCalculatorProps) {
  const calculatorData = priceData[serviceType]
  const materialOptions = calculatorData.materials
  const [selectedMaterial, setSelectedMaterial] = useState<string>(Object.keys(materialOptions)[0])
  const [sizeValue, setSizeValue] = useState<string>(
    calculatorData.sizeOptions?.[0]?.value?.toString() ?? calculatorData.minSize.toString()
  )
  const [heightValue, setHeightValue] = useState<string>("3")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [result, setResult] = useState<number | null>(null)
  const [domeType, setDomeType] = useState<"luar" | "dalam">("luar")

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    )
  }

  const calculatePrice = () => {
    if (serviceType === "kubah") {
      const diameter = parseFloat(sizeValue)
      const tinggi = parseFloat(heightValue)
      const lebar = diameter * 3.14
      const luas = lebar * tinggi
      const basePrice = domeType === "luar" ? 850000 : 750000
      let totalPrice = luas * basePrice

      if (calculatorData.additionalOptions) {
        calculatorData.additionalOptions.forEach(option => {
          if (selectedOptions.includes(option.id)) {
            totalPrice += option.price
          }
        })
      }

      setResult(totalPrice)
    } else {
      const basePrice = materialOptions[selectedMaterial].price
      const size = parseFloat(sizeValue)
      const sizeMultiplier = calculatorData.sizeMultiplier * size
      let totalPrice = basePrice * sizeMultiplier

      if (calculatorData.additionalOptions) {
        calculatorData.additionalOptions.forEach(option => {
          if (selectedOptions.includes(option.id)) {
            totalPrice += option.price
          }
        })
      }

      setResult(totalPrice)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="h-6 w-6" />
            <CardTitle>{calculatorData.title}</CardTitle>
          </div>
          <CardDescription className="text-white/80">{calculatorData.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Pilihan Kubah Luar/Dalam (hanya untuk kubah) */}
          {serviceType === "kubah" && (
            <div className="space-y-2">
              <Label className="block mb-2">Jenis Kubah</Label>
              <div className="flex gap-2">
                <Button
                  variant={domeType === "luar" ? "default" : "outline"}
                  onClick={() => setDomeType("luar")}
                  className="flex-1"
                >
                  Kubah Luar
                </Button>
                <Button
                  variant={domeType === "dalam" ? "default" : "outline"}
                  onClick={() => setDomeType("dalam")}
                  className="flex-1"
                >
                  Kubah Dalam
                </Button>
              </div>
            </div>
          )}

          {/* Material Selection (untuk selain kubah) */}
          {serviceType !== "kubah" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="material-type">Jenis Material</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full bg-white hover:bg-gray-100 focus:bg-white"
                      >
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-white">
                      <p className="text-sm">Pilih material yang sesuai dengan kebutuhan dan budget Anda</p>
                      <ul className="mt-2 list-disc pl-4 space-y-1">
                        {Object.entries(materialOptions).map(([key, material]) => (
                          <li key={key} className="text-sm">
                            <strong>{material.name}</strong>: {formatCurrency(material.price)} per m²
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(materialOptions).map(([value, material]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`material-${value}`}
                        name="material-type"
                        value={value}
                        checked={selectedMaterial === value}
                        onChange={() => setSelectedMaterial(value)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <Label htmlFor={`material-${value}`} className="text-sm font-normal">
                        {material.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input untuk diameter/size */}
          <div className="space-y-2">
            <Label htmlFor="size">{calculatorData.sizeLabel}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="size"
                type="number"
                min={calculatorData.minSize}
                max={calculatorData.maxSize}
                value={sizeValue}
                onChange={(e) => setSizeValue(e.target.value)}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Min: {calculatorData.minSize}, Max: {calculatorData.maxSize}
              </span>
            </div>
          </div>

          {/* Input khusus untuk tinggi kubah (hanya muncul untuk kubah) */}
          {serviceType === "kubah" && (
            <div className="space-y-2">
              <Label htmlFor="height">Tinggi Kubah (meter)</Label>
              <Input
                id="height"
                type="number"
                min="1"
                max="15"
                value={heightValue}
                onChange={(e) => setHeightValue(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Additional Options */}
          {calculatorData.additionalOptions && (
            <div className="mt-6">
              <Label className="mb-2 block">Opsi Tambahan</Label>
              <div className="grid gap-3">
                {calculatorData.additionalOptions.map(option => (
                  <div key={option.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => toggleOption(option.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={option.id} className="flex-1 flex items-center justify-between">
                      <span>{option.name}</span>
                      <span className="text-primary font-medium">
                        +{formatCurrency(option.price)}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <InfoIcon className="h-4 w-4" />
              Catatan Penting
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
              {calculatorData.catatan.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button 
            onClick={calculatePrice} 
            className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 active:scale-[0.98] transition-all duration-200"
            size="lg"
          >
            Hitung Estimasi Biaya
          </Button>

          {result !== null && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center animate-fade-in">
              <p className="text-gray-600 mb-1">Estimasi Biaya:</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(result)}
              </p>
              {serviceType === "kubah" && (
                <div className="mt-2 text-sm text-gray-500">
                  <p>Diameter: {sizeValue} meter</p>
                  <p>Tinggi: {heightValue} meter</p>
                  <p>Lebar: {(parseFloat(sizeValue) * 3.14).toFixed(2)} meter</p>
                  <p>Luas: {(parseFloat(sizeValue) * 3.14 * parseFloat(heightValue)).toFixed(2)} m²</p>
                  <p>Jenis: Kubah {domeType === "luar" ? "Luar" : "Dalam"}</p>
                </div>
              )}
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p>*Harga dapat berubah sesuai spesifikasi detail</p>
                <p>*Terima pembayaran: 50% di awal, 40% progres, 10% finishing</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}