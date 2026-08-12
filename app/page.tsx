import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
{/* HEADER */}

<header className="border-b border-black/5 bg-white">
  <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

    <div className="flex items-center">
      <Image
        src="/bricer-logo.png"
        alt="Bricer"
        width={160}
        height={60}
        priority
        className="h-auto w-[160px]"
      />
    </div>

    <div className="hidden text-sm text-gray-500 sm:block">
      Simulador de proteção empresarial
    </div>

  </div>
</header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          
          {/* Content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-[#213979]/10 bg-white px-4 py-2 text-sm font-medium text-[#213979] shadow-sm">
              Proteção empresarial inteligente
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#213979] sm:text-5xl lg:text-6xl">
              Sua empresa merece uma proteção à altura do seu futuro.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Descubra, de forma simples e personalizada, quais são as
              principais necessidades de proteção da sua empresa.
            </p>


            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
              <span>✓ Simples e rápido</span>
              <span>✓ Análise personalizada</span>
              <span>✓ Sem compromisso</span>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#dce7f5] blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-[#e8edf4] blur-3xl" />

            <div className="relative rounded-3xl border border-black/5 bg-white p-6 shadow-2xl shadow-[#213979]/10 sm:p-8">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Perfil empresarial
                  </p>

                  <h2 className="mt-1 text-x1 font-bold text-[#213979] sm:text-3xl lg:text-4xl">
                  Identifique as necessidades da sua empresa
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-[#f7f8fa] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Proteção dos sócios
                    </span>

                    <span className="text-sm font-semibold text-[#676a71]">
                      Avaliar
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-[72%] rounded-full bg-[#514d4d]" />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#f7f8fa] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Continuidade empresarial
                    </span>

                    <span className="text-sm font-semibold text-[#676a71]">
                      Avaliar
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-[58%] rounded-full bg-[#514d4d]" />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#f7f8fa] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Proteção financeira
                    </span>

                    <span className="text-sm font-semibold text-[#676a71]">
                      Avaliar
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-[84%] rounded-full bg-[#514d4d]" />
                  </div>
                </div>
              </div>

                <div className="mt-8">
              <a
                href="/simulacao"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#217923] px-7 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#e21414] hover:shadow-xl"
              >
                Começar minha simulação
                <span className="ml-3 text-lg">→</span>
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}