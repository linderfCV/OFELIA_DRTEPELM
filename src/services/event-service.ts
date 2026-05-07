import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Servicio centralizado para registrar eventos en la colección ofelia_eventos.
 */
export async function logOfeliaEvent(eventData: any) {
  try {
    const docRef = await addDoc(collection(db, "ofelia_eventos"), {
      ...eventData,
      fechaHora: serverTimestamp(),
    });
    console.log("Evento registrado con ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error al registrar evento en Firestore:", error);
    return { success: false, error: error.message };
  }
}