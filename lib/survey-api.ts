// API para guardar encuestas en la base de datos
// Descomentar y configurar cuando esté lista la integración con Supabase/Neon

/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function saveEntrySurvey(reason: string) {
  const { data, error } = await supabase
    .from('surveys')
    .insert({
      survey_type: 'entry',
      entry_reason: reason,
      user_session: getSessionId(),
    })
  
  if (error) throw error
  return data
}

export async function saveExitSurvey(rating: number, feedback?: string) {
  const { data, error } = await supabase
    .from('surveys')
    .insert({
      survey_type: 'exit',
      exit_rating: rating,
      exit_feedback: feedback,
      user_session: getSessionId(),
    })
  
  if (error) throw error
  return data
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Función para obtener estadísticas
export async function getSatisfactionStats(days: number = 30) {
  const { data, error } = await supabase
    .from('satisfaction_stats')
    .select('*')
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
  
  if (error) throw error
  return data
}
*/

// Por ahora, usar localStorage
export function saveToLocalStorage(survey: any) {
  const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
  surveys.push(survey)
  localStorage.setItem("surveys", JSON.stringify(surveys))
}

export function getLocalSurveys() {
  return JSON.parse(localStorage.getItem("surveys") || "[]")
}
