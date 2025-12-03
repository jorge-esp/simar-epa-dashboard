import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WaveIcon, WindIcon, ThermometerIcon, CompassIcon, TrendingUpIcon } from "@/components/icons"
import { BookIcon } from "@/components/icons" // Added import for BookIcon

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Oleaje: WaveIcon,
  Viento: WindIcon,
  "Condiciones Atmosféricas": ThermometerIcon,
  Navegación: CompassIcon,
  "Interpretación de Datos": TrendingUpIcon,
}

const glossaryTerms = [
  {
    category: "Oleaje",
    terms: [
      {
        term: "Altura de Olas (m)",
        definition:
          "Distancia vertical entre la cresta (punto más alto) y el valle (punto más bajo) de una ola. Se mide en metros.",
        example:
          "Una altura de 2.5m indica olas moderadas, mientras que 5m+ indica olas grandes y potencialmente peligrosas.",
      },
      {
        term: "Período de Olas (s)",
        definition:
          "Tiempo en segundos que transcurre entre el paso de dos crestas consecutivas por un punto fijo. Períodos más largos indican olas más potentes.",
        example:
          "Un período de 12-15 segundos indica swell de larga distancia, ideal para surf. Períodos de 5-8 segundos indican mar de viento local.",
      },
      {
        term: "Dirección de Olas (°)",
        definition:
          "Dirección desde donde vienen las olas, medida en grados (0-360°). 0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste.",
        example: "225° (SO) significa que las olas vienen desde el Suroeste.",
      },
      {
        term: "Dispersión Direccional (°)",
        definition:
          "Medida de cuán concentradas están las olas en una dirección. Valores bajos (< 30°) indican olas ordenadas de una dirección, valores altos indican mar confuso.",
        example: "Una dispersión de 15° indica condiciones limpias y ordenadas. 45° indica mar cruzado o confuso.",
      },
      {
        term: "Cantidad de Olas",
        definition:
          "Número de olas que pasan por un punto en un período de tiempo determinado. Útil para evaluar la frecuencia del oleaje.",
        example: "Mayor cantidad de olas puede indicar mar picado con olas cortas y frecuentes.",
      },
    ],
  },
  {
    category: "Viento",
    terms: [
      {
        term: "Velocidad del Viento (m/s)",
        definition:
          "Rapidez del movimiento del aire medida en metros por segundo. También se puede expresar en nudos (1 m/s ≈ 1.94 nudos).",
        example: "5 m/s (10 nudos) = brisa suave, 15 m/s (29 nudos) = viento fuerte, 25+ m/s (48+ nudos) = temporal.",
      },
      {
        term: "Dirección del Viento (°)",
        definition:
          "Dirección desde donde sopla el viento, medida en grados. Importante para navegación y predicción de condiciones.",
        example: "Un viento de 180° (Sur) sopla desde el sur hacia el norte.",
      },
      {
        term: "Ráfagas",
        definition:
          "Aumentos súbitos y temporales en la velocidad del viento. Pueden ser significativamente más fuertes que el viento sostenido.",
        example: "Viento sostenido de 10 m/s con ráfagas de 18 m/s.",
      },
    ],
  },
  {
    category: "Condiciones Atmosféricas",
    terms: [
      {
        term: "Presión Atmosférica (hPa)",
        definition:
          "Peso del aire sobre la superficie, medido en hectopascales. Indica sistemas de alta o baja presión que afectan el clima.",
        example:
          "1013 hPa = presión normal al nivel del mar. < 1000 hPa indica baja presión (mal tiempo), > 1020 hPa indica alta presión (buen tiempo).",
      },
      {
        term: "Temperatura del Aire (°C)",
        definition:
          "Temperatura del aire ambiente medida en grados Celsius. Afecta la comodidad y las condiciones de trabajo en el puerto.",
        example: "15-20°C es temperatura agradable para actividades marítimas en Arica.",
      },
    ],
  },
  {
    category: "Navegación",
    terms: [
      {
        term: "Puntos Cardinales",
        definition:
          "Direcciones principales: Norte (N/0°), Este (E/90°), Sur (S/180°), Oeste (O/270°). Los puntos intermedios incluyen NE, SE, SO, NO.",
        example: "SO (Suroeste) = 225°, indica dirección entre Sur y Oeste.",
      },
      {
        term: "Mar de Viento",
        definition: "Olas generadas localmente por el viento actual. Suelen ser más cortas, empinadas y desordenadas.",
        example: "Períodos cortos (5-8s) con dispersión alta indican mar de viento.",
      },
      {
        term: "Swell (Mar de Fondo)",
        definition:
          "Olas que viajan largas distancias desde su origen. Son más largas, ordenadas y potentes que el mar de viento.",
        example: "Períodos largos (12-20s) con baja dispersión indican swell de larga distancia.",
      },
    ],
  },
  {
    category: "Interpretación de Datos",
    terms: [
      {
        term: "Tendencia",
        definition: "Patrón de cambio en los datos a lo largo del tiempo. Puede ser ascendente, descendente o estable.",
        example: "Una tendencia ascendente en la altura de olas indica que las condiciones están empeorando.",
      },
      {
        term: "Promedio",
        definition:
          "Valor medio de un conjunto de mediciones. Útil para entender las condiciones típicas en un período.",
        example:
          "Si el promedio de altura de olas es 1.5m pero el actual es 3m, las condiciones están por encima de lo normal.",
      },
      {
        term: "Valor Actual",
        definition: "La medición más reciente de un parámetro. Representa las condiciones en tiempo real.",
        example: "El valor actual es la última lectura de la boya, actualizada cada pocos minutos.",
      },
    ],
  },
]

export default function GlosarioPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
          <BookIcon size={28} className="text-primary" />
          Glosario de Términos Marítimos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Definiciones y explicaciones de los términos técnicos utilizados en el sistema de monitoreo SIMAR-EPA
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {glossaryTerms.map((category) => {
          const IconComponent = categoryIcons[category.category] || WaveIcon
          return (
            <Card key={category.category} className="bg-card">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-card-foreground flex items-center gap-2 text-lg sm:text-xl">
                  <IconComponent size={24} className="text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {category.terms.map((item) => (
                    <div key={item.term} className="border-l-2 sm:border-l-4 border-primary/30 pl-3 sm:pl-4 py-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{item.term}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-2">{item.definition}</p>
                      <div className="bg-muted/50 rounded-lg p-2 sm:p-3 mt-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Ejemplo:</span> {item.example}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
