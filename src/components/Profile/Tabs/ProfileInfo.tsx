import { Clock3, Mail, MailCheck, User } from "lucide-react";

export default function ProfileInfo() {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-4 bg-secondary rounded-t-2xl p-4">
          <User className="w-12 h-12 bg-white/90 p-2 rounded-full"/>
          <div className="text-white">
            <h4 className="font-medium text-xl">Marcos Dias</h4>
            <span className="text-sm text-white/70">email@gmail.com</span>
          </div>
        </div>
        <div className="flex justify-between p-4">
          <div className="flex gap-2">
            <Mail />
            {/* <MailCheck /> */}
            <span>Status da Conta</span>
          </div>
          <div className="flex gap-2">
            <Clock3 />
            <span>Verificar Conta</span>
          </div>
        </div>
      </div>
    </section>
  )
}