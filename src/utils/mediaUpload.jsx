import { createClient } from "@supabase/supabase-js"

const url = "https://hpqqmlrdndyglszpocpe.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcXFtbHJkbmR5Z2xzenBvY3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjEyMTMsImV4cCI6MjA2NDc5NzIxM30.6yCxYWmaote9MJLebzzRn7pgw82oyzGUcqR3w0TDZ34"

const supabase = createClient(url,key)

export default function mediaUpload(file){
    const mediaUploadPromise = new Promise(
        (resolve, reject)=>{
            if(file == null){
                reject("No file selected")
            }

            const timestamp = new Date().getTime()
            const newName = timestamp + file.name 

            supabase.storage.from("cbc-images").upload(newName, file, {
                upsert: false,
                cacheControl: "3600"
            }).then(()=>{
                const publicUrl = supabase.storage.from("cbc-images").getPublicUrl(newName).data.publicUrl
                resolve(publicUrl)          
            }).catch(
                (e)=>{
                    reject("Error occured in supabase connection") 
                }
            )
            }
    )
    
    return mediaUploadPromise
}