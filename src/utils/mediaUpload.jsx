import { createClient } from "@supabase/supabase-js"

const url = "https://midiawwlkxfveuavpctm.supabase.co"
const key = "sb_publishable_jiWya-tpaSzy1vYf3JVBDA_L6DLfZMN"

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