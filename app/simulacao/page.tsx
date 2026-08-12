"use client";

import Image from "next/image";
import { useState } from "react";
import { generateBricerPdf } from "../lib/generatePdf";

const segments = [
  "Comércio",
  "Indústria",
  "Serviços",
  "Tecnologia",
  "Construção",
  "Saúde",
  "Educação",
  "Outro",
];

const companySizes = [
  "Microempresa",
  "Pequena empresa",
  "Média empresa",
  "Grande empresa",
];

const employeeRanges = [
  "1 a 5 funcionários",
  "6 a 10 funcionários",
  "11 a 30 funcionários",
  "31 a 50 funcionários",
  "51 a 100 funcionários",
  "101 a 500 funcionários",
  "Mais de 500 funcionários",
];

const partnerRanges = [
  "1 sócio",
  "2 sócios",
  "3 sócios",
  "4 a 5 sócios",
  "Mais de 5 sócios",
];

const partnerImpactOptions = [
  "Sim, impactaria muito",
  "Sim, impactaria parcialmente",
  "Pouco impacto",
  "Não impactaria",
  "Não sei avaliar",
];

const concerns = [
  "Falta de recursos em uma situação inesperada",
  "Perda ou afastamento de um sócio",
  "Proteção da família dos sócios",
  "Continuidade da empresa",
  "Proteção dos funcionários",
  "Sucessão empresarial",
  "Outro",
];

type FormData = {
  segment: string;
  companySize: string;
  employees: string;
  partners: string;
  partnerImpact: string;
  concerns: string[];
};

type AnalysisResult = {
  score: number;
  level: string;
  levelDescription: string;
  attentionPoints: string[];
  recommendations: string[];
};

function calculateAnalysis(data: FormData): AnalysisResult {

    async function loadImageAsDataURL(
  src: string
): Promise<string> {
  const response = await fetch(src);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}


  let score = 0;

  const attentionPoints: string[] = [];
  const recommendations: string[] = [];

  // --------------------------------
  // PORTE DA EMPRESA
  // --------------------------------

  if (data.companySize === "Grande empresa") {
    score += 15;
  } else if (data.companySize === "Média empresa") {
    score += 12;
  } else if (data.companySize === "Pequena empresa") {
    score += 8;
  } else {
    score += 5;
  }

  // --------------------------------
  // FUNCIONÁRIOS
  // --------------------------------

  if (
    data.employees === "Mais de 500 funcionários" ||
    data.employees === "101 a 500 funcionários"
  ) {
    score += 15;
  } else if (
    data.employees === "51 a 100 funcionários" ||
    data.employees === "31 a 50 funcionários"
  ) {
    score += 12;
  } else if (data.employees === "11 a 30 funcionários") {
    score += 9;
  } else {
    score += 5;
  }

  // --------------------------------
  // SÓCIOS
  // --------------------------------

  if (
    data.partners === "4 a 5 sócios" ||
    data.partners === "Mais de 5 sócios"
  ) {
    score += 10;
  } else if (data.partners === "2 sócios" || data.partners === "3 sócios") {
    score += 8;
  } else {
    score += 5;
  }

  // --------------------------------
  // IMPACTO DA SAÍDA DE UM SÓCIO
  // --------------------------------

  if (data.partnerImpact === "Sim, impactaria muito") {
    score += 25;

    attentionPoints.push(
      "A empresa apresenta forte dependência da participação dos sócios."
    );

    recommendations.push(
      "Proteção financeira para continuidade da empresa em situações envolvendo sócios."
    );
  } else if (data.partnerImpact === "Sim, impactaria parcialmente") {
    score += 18;

    attentionPoints.push(
      "A saída de um sócio poderia gerar impacto relevante na operação."
    );

    recommendations.push(
      "Avaliação de soluções para reduzir os impactos financeiros relacionados aos sócios."
    );
  } else if (data.partnerImpact === "Pouco impacto") {
    score += 10;
  } else if (data.partnerImpact === "Não sei avaliar") {
    score += 8;

    attentionPoints.push(
      "Existe uma oportunidade de avaliar melhor a dependência da empresa em relação aos sócios."
    );
  } else {
    score += 3;
  }

  // --------------------------------
  // PREOCUPAÇÕES
  // --------------------------------

  if (
    data.concerns.includes(
      "Falta de recursos em uma situação inesperada"
    )
  ) {
    score += 8;

    attentionPoints.push(
      "Existe preocupação com a disponibilidade de recursos diante de situações inesperadas."
    );

    recommendations.push(
      "Planejamento de proteção financeira para situações inesperadas."
    );
  }

  if (
    data.concerns.includes(
      "Perda ou afastamento de um sócio"
    )
  ) {
    score += 10;

    attentionPoints.push(
      "A continuidade do negócio pode ser afetada pela ausência de um sócio."
    );

    recommendations.push(
      "Proteção relacionada à continuidade e estabilidade societária."
    );
  }

  if (
    data.concerns.includes(
      "Proteção da família dos sócios"
    )
  ) {
    score += 7;

    attentionPoints.push(
      "A proteção financeira das famílias dos sócios é uma prioridade."
    );

    recommendations.push(
      "Soluções de proteção para os sócios e suas famílias."
    );
  }

  if (
    data.concerns.includes(
      "Continuidade da empresa"
    )
  ) {
    score += 10;

    attentionPoints.push(
      "A continuidade da empresa é considerada uma preocupação importante."
    );

    recommendations.push(
      "Planejamento de proteção voltado à continuidade empresarial."
    );
  }

  if (
    data.concerns.includes(
      "Proteção dos funcionários"
    )
  ) {
    score += 6;

    attentionPoints.push(
      "A proteção dos colaboradores é uma prioridade para a empresa."
    );

    recommendations.push(
      "Avaliação de soluções de proteção para colaboradores."
    );
  }

  if (
    data.concerns.includes(
      "Sucessão empresarial"
    )
  ) {
    score += 8;

    attentionPoints.push(
      "Existe uma preocupação relacionada à sucessão do negócio."
    );

    recommendations.push(
      "Planejamento sucessório e proteção da continuidade empresarial."
    );
  }

  if (data.concerns.includes("Outro")) {
    score += 4;

    recommendations.push(
      "Análise personalizada das necessidades específicas da empresa."
    );
  }

  // --------------------------------
  // LIMITE
  // --------------------------------

  score = Math.min(score, 100);

  // --------------------------------
  // NÍVEL
  // --------------------------------

  let level = "";
  let levelDescription = "";

  if (score <= 30) {
    level = "Proteção inicial";
    levelDescription =
      "Sua empresa apresenta necessidades iniciais de proteção que podem ser avaliadas de forma preventiva.";
  } else if (score <= 50) {
    level = "Proteção moderada";
    levelDescription =
      "Sua empresa apresenta alguns pontos que merecem atenção e podem ser melhor protegidos.";
  } else if (score <= 70) {
    level = "Atenção elevada";
    levelDescription =
      "Sua empresa apresenta fatores relevantes que indicam a necessidade de uma análise de proteção mais estruturada.";
  } else if (score <= 85) {
    level = "Alto nível de atenção";
    levelDescription =
      "Sua empresa apresenta fatores importantes de exposição que merecem uma avaliação especializada.";
  } else {
    level = "Proteção prioritária";
    levelDescription =
      "Sua empresa apresenta diversos fatores que tornam recomendável uma análise especializada de proteção empresarial.";
  }

  // --------------------------------
  // EVITA DUPLICIDADES
  // --------------------------------

  const uniqueAttentionPoints = [
    ...new Set(attentionPoints),
  ];

  const uniqueRecommendations = [
    ...new Set(recommendations),
  ];

  return {
    score,
    level,
    levelDescription,
    attentionPoints: uniqueAttentionPoints,
    recommendations: uniqueRecommendations,
  };
}

export default function SimulacaoPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    segment: "",
    companySize: "",
    employees: "",
    partners: "",
    partnerImpact: "",
    concerns: [],
  });

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  function toggleConcern(concern: string) {
    setFormData((current) => {
      if (current.concerns.includes(concern)) {
        return {
          ...current,
          concerns: current.concerns.filter(
            (item) => item !== concern
          ),
        };
      }

      return {
        ...current,
        concerns: [
          ...current.concerns,
          concern,
        ],
      };
    });
  }

  function handleNext() {
    if (step === 1 && !formData.segment) return;

    if (step === 2 && !formData.companySize) return;

    if (step === 3 && !formData.employees) return;

    if (
      step === 4 &&
      (!formData.partners ||
        !formData.partnerImpact)
    ) {
      return;
    }

    if (
      step === 5 &&
      formData.concerns.length === 0
    ) {
      return;
    }

    if (step === 5) {
      const analysis =
        calculateAnalysis(formData);

      setResult(analysis);

      setStep(6);

      return;
    }

    setStep((current) => current + 1);
  }

  function handleBack() {
    if (step === 6) {
      setStep(5);
      return;
    }

    setStep((current) => current - 1);
  }

  const progress =
    step >= 6
      ? 100
      : Math.min((step / 5) * 100, 100);

  return (
    <main className="min-h-screen bg-[#f7f8fa]">

 {/* HEADER */}

<header className="border-b border-black/5 bg-white">
  <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">

    <div className="flex items-center">
      <Image
        src="/bricer-logo.png"
        alt="Bricer"
        width={150}
        height={60}
        priority
        className="h-auto w-[150px]"
      />
    </div>

    <div className="text-sm text-gray-500">
      Simulação de proteção empresarial
    </div>

  </div>
</header>

      {/* CONTEÚDO */}

      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">

        {/* PROGRESSO */}

        <div className="mb-10">

          <div className="mb-3 flex items-center justify-between text-sm">

            <span className="font-medium text-[#213979]">
              {step === 6
                ? "Simulação concluída"
                : `Etapa ${step} de 5`}
            </span>

            <span className="text-gray-500">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-[#213979] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* CARD */}

        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-[#213979]/5 sm:p-10">

          {/* ========================= */}
          {/* ETAPA 1 */}
          {/* ========================= */}

          {step === 1 && (
            <div>

              <div className="mb-8">

                <span className="text-sm font-semibold uppercase tracking-wider text-[#e21414]">
                  Sobre sua empresa
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#213979] sm:text-4xl">
                  Vamos conhecer sua empresa
                </h1>

                <p className="mt-3 max-w-xl leading-7 text-gray-600">
                  Essas informações nos ajudam a entender melhor o perfil
                  do seu negócio e identificar suas principais necessidades
                  de proteção.
                </p>

              </div>

              <label className="text-lg font-semibold text-gray-900">
                Qual é o segmento da sua empresa?
              </label>

              <p className="mt-1 text-sm text-gray-500">
                Selecione a opção que mais se aproxima da atividade da
                sua empresa.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {segments.map((item) => {

                  const selected =
                    formData.segment === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          segment: item,
                        })
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-[#213979] bg-[#213979]/5 ring-2 ring-[#213979]/10"
                          : "border-gray-200 bg-white hover:border-[#213979]/40 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span
                          className={
                            selected
                              ? "font-medium text-[#213979]"
                              : "font-medium text-gray-700"
                          }
                        >
                          {item}
                        </span>

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                            selected
                              ? "border-[#213979] bg-[#213979] text-white"
                              : "border-gray-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                      </div>

                    </button>
                  );

                })}

              </div>

            </div>
          )}

          {/* ========================= */}
          {/* ETAPA 2 */}
          {/* ========================= */}

          {step === 2 && (
            <div>

              <div className="mb-8">

                <span className="text-sm font-semibold uppercase tracking-wider text-[#e21414]">
                  Perfil da empresa
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#213979] sm:text-4xl">
                  Qual é o porte da sua empresa?
                </h1>

                <p className="mt-3 max-w-xl leading-7 text-gray-600">
                  Essa informação nos ajuda a entender a estrutura e o
                  nível de proteção necessário para o seu negócio.
                </p>

              </div>

              <label className="text-lg font-semibold text-gray-900">
                Selecione uma opção
              </label>

              <div className="mt-6 space-y-3">

                {companySizes.map((item) => {

                  const selected =
                    formData.companySize === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          companySize: item,
                        })
                      }
                      className={`w-full rounded-2xl border p-5 text-left transition-all ${
                        selected
                          ? "border-[#213979] bg-[#213979]/5 ring-2 ring-[#213979]/10"
                          : "border-gray-200 bg-white hover:border-[#213979]/40 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span
                          className={
                            selected
                              ? "font-medium text-[#213979]"
                              : "font-medium text-gray-700"
                          }
                        >
                          {item}
                        </span>

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-sm ${
                            selected
                              ? "border-[#213979] bg-[#213979] text-white"
                              : "border-gray-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                      </div>

                    </button>
                  );

                })}

              </div>

            </div>
          )}

          {/* ========================= */}
          {/* ETAPA 3 */}
          {/* ========================= */}

          {step === 3 && (
            <div>

              <div className="mb-8">

                <span className="text-sm font-semibold uppercase tracking-wider text-[#e21414]">
                  Estrutura da empresa
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#213979] sm:text-4xl">
                  Quantos funcionários sua empresa possui?
                </h1>

                <p className="mt-3 max-w-xl leading-7 text-gray-600">
                  O número de colaboradores nos ajuda a entender a
                  dimensão da sua operação e suas necessidades de proteção.
                </p>

              </div>

              <label className="text-lg font-semibold text-gray-900">
                Selecione uma faixa
              </label>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {employeeRanges.map((item) => {

                  const selected =
                    formData.employees === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          employees: item,
                        })
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-[#213979] bg-[#213979]/5 ring-2 ring-[#213979]/10"
                          : "border-gray-200 bg-white hover:border-[#213979]/40 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span
                          className={
                            selected
                              ? "font-medium text-[#213979]"
                              : "font-medium text-gray-700"
                          }
                        >
                          {item}
                        </span>

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                            selected
                              ? "border-[#213979] bg-[#213979] text-white"
                              : "border-gray-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                      </div>

                    </button>
                  );

                })}

              </div>

            </div>
          )}

          {/* ========================= */}
          {/* ETAPA 4 */}
          {/* ========================= */}

          {step === 4 && (
            <div>

              <div className="mb-8">

                <span className="text-sm font-semibold uppercase tracking-wider text-[#e21414]">
                  Sócios e liderança
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#213979] sm:text-4xl">
                  Vamos entender a estrutura societária
                </h1>

                <p className="mt-3 max-w-xl leading-7 text-gray-600">
                  A dependência da empresa em relação aos seus sócios é
                  um fator importante na análise de proteção empresarial.
                </p>

              </div>

              <label className="text-lg font-semibold text-gray-900">
                Quantos sócios a empresa possui?
              </label>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {partnerRanges.map((item) => {

                  const selected =
                    formData.partners === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          partners: item,
                        })
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-[#213979] bg-[#213979]/5 ring-2 ring-[#213979]/10"
                          : "border-gray-200 bg-white hover:border-[#213979]/40 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span
                          className={
                            selected
                              ? "font-medium text-[#213979]"
                              : "font-medium text-gray-700"
                          }
                        >
                          {item}
                        </span>

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                            selected
                              ? "border-[#213979] bg-[#213979] text-white"
                              : "border-gray-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                      </div>

                    </button>
                  );

                })}

              </div>

              <div className="mt-8">

                <label className="text-lg font-semibold text-gray-900">
                  Se um dos sócios deixasse a empresa, qual seria o impacto?
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Pense no impacto financeiro, operacional ou estratégico.
                </p>

                <div className="mt-5 space-y-3">

                  {partnerImpactOptions.map((item) => {

                    const selected =
                      formData.partnerImpact === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            partnerImpact: item,
                          })
                        }
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                          selected
                            ? "border-[#213979] bg-[#213979]/5 ring-2 ring-[#213979]/10"
                            : "border-gray-200 bg-white hover:border-[#213979]/40 hover:bg-gray-50"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <span
                            className={
                              selected
                                ? "font-medium text-[#213979]"
                                : "font-medium text-gray-700"
                            }
                          >
                            {item}
                          </span>

                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                              selected
                                ? "border-[#213979] bg-[#213979] text-white"
                                : "border-gray-300 text-transparent"
                            }`}
                          >
                            ✓
                          </span>

                        </div>

                      </button>
                    );

                  })}

                </div>

              </div>

            </div>
          )}

          {/* ========================= */}
          {/* ETAPA 5 */}
          {/* ========================= */}

          {step === 5 && (
            <div>

              <div className="mb-8">

                <span className="text-sm font-semibold uppercase tracking-wider text-[#e21414]">
                  Suas prioridades
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#213979] sm:text-4xl">
                  O que mais preocupa você?
                </h1>

                <p className="mt-3 max-w-xl leading-7 text-gray-600">
                  Selecione uma ou mais situações que você considera
                  importantes para a proteção da sua empresa.
                </p>

              </div>

              <label className="text-lg font-semibold text-gray-900">
                Quais situações mais preocupam você?
              </label>

              <p className="mt-1 text-sm text-gray-500">
                Você pode selecionar mais de uma opção.
              </p>

              <div className="mt-6 space-y-3">

                {concerns.map((item) => {

                  const selected =
                    formData.concerns.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleConcern(item)
                      }
                      className={`w-full rounded-2xl border p-5 text-left transition-all ${
                        selected
                          ? "border-[#213979] bg-[#213979]/5 ring-2 ring-[#213979]/10"
                          : "border-gray-200 bg-white hover:border-[#213979]/40 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-center justify-between gap-4">

                        <span
                          className={
                            selected
                              ? "font-medium text-[#213979]"
                              : "font-medium text-gray-700"
                          }
                        >
                          {item}
                        </span>

                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-sm ${
                            selected
                              ? "border-[#213979] bg-[#213979] text-white"
                              : "border-gray-300 text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                      </div>

                    </button>
                  );

                })}

              </div>

              {formData.concerns.length > 0 && (
                <p className="mt-4 text-sm font-medium text-[#213979]">
                  {formData.concerns.length}{" "}
                  {formData.concerns.length === 1
                    ? "prioridade selecionada"
                    : "prioridades selecionadas"}
                </p>
              )}

            </div>
          )}

          {/* ========================= */}
          {/* RESULTADO */}
          {/* ========================= */}

          {step === 6 && result && (
            <div>

              <div className="text-center">

                <span className="text-sm font-semibold uppercase tracking-wider text-[#e21414]">
                  Análise concluída
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#213979] sm:text-4xl">
                  Seu perfil de proteção empresarial
                </h1>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
                  Com base nas informações fornecidas, identificamos
                  alguns pontos importantes para a proteção da sua empresa.
                </p>

              </div>

              {/* SCORE */}

              <div className="mt-10 rounded-3xl bg-[#213979] p-8 text-center text-white">

                <p className="text-sm font-medium uppercase tracking-wider text-white/70">
                  Índice de atenção
                </p>

                <div className="mt-3 text-6xl font-bold">
                  {result.score}
                  <span className="text-2xl text-white/60">
                    /100
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-semibold">
                  {result.level}
                </h2>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-white/80">
                  {result.levelDescription}
                </p>

              </div>

              {/* PERFIL */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-gray-200 p-5">

                  <p className="text-sm text-gray-500">
                    Segmento
                  </p>

                  <p className="mt-1 font-semibold text-[#213979]">
                    {formData.segment}
                  </p>

                </div>

                <div className="rounded-2xl border border-gray-200 p-5">

                  <p className="text-sm text-gray-500">
                    Porte
                  </p>

                  <p className="mt-1 font-semibold text-[#213979]">
                    {formData.companySize}
                  </p>

                </div>

                <div className="rounded-2xl border border-gray-200 p-5">

                  <p className="text-sm text-gray-500">
                    Funcionários
                  </p>

                  <p className="mt-1 font-semibold text-[#213979]">
                    {formData.employees}
                  </p>

                </div>

                <div className="rounded-2xl border border-gray-200 p-5">

                  <p className="text-sm text-gray-500">
                    Sócios
                  </p>

                  <p className="mt-1 font-semibold text-[#213979]">
                    {formData.partners}
                  </p>

                </div>

              </div>

              {/* PONTOS DE ATENÇÃO */}

              <div className="mt-10">

                <h2 className="text-xl font-bold text-[#213979]">
                  Principais pontos de atenção
                </h2>

                <div className="mt-4 space-y-3">

                  {result.attentionPoints.length > 0 ? (
                    result.attentionPoints.map(
                      (point, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4"
                        >

                          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e21414] text-xs text-white">
                            !
                          </div>

                          <p className="text-sm leading-6 text-gray-700">
                            {point}
                          </p>

                        </div>
                      )
                    )
                  ) : (
                    <div className="rounded-2xl border border-gray-200 p-5 text-sm text-gray-600">
                      Não identificamos pontos críticos com base nas
                      respostas fornecidas.
                    </div>
                  )}

                </div>

              </div>

              {/* RECOMENDAÇÕES */}

              <div className="mt-10">

                <h2 className="text-xl font-bold text-[#213979]">
                  Recomendações
                </h2>

                <div className="mt-4 space-y-3">

                  {result.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4"
                      >

                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#213979] text-xs font-bold text-white">
                          ✓
                        </div>

                        <p className="text-sm leading-6 text-gray-700">
                          {recommendation}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* CTA */}

              <div className="mt-10 rounded-3xl border border-[#213979]/10 bg-[#213979]/5 p-6 text-center">

                <h2 className="text-xl font-bold text-[#213979]">
                  Quer entender melhor esse resultado?
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
                  Nossa equipe pode analisar seu cenário de forma
                  personalizada e apresentar as alternativas de proteção
                  mais adequadas para sua empresa.
                </p>

               <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

  <button
    type="button"
    onClick={() => {
      if (!result) return;

      generateBricerPdf({
        ...formData,
        ...result,
      });
    }}
    className="h-12 rounded-xl border border-[#213979] bg-white px-6 font-semibold text-[#213979] transition hover:bg-[#213979]/5"
  >
    📄 Baixar análise em PDF
  </button>

 <a
  href="https://wa.me/5521969145990?text=Ol%C3%A1!%20Eu%20fiz%20uma%20simula%C3%A7%C3%A3o%20de%20prote%C3%A7%C3%A3o%20empresarial(sistema%20Bricer%20Company)%20e%20gostaria%20de%20um%20suporte"
  target="_blank"
  rel="noopener noreferrer"
  className="flex h-12 items-center justify-center rounded-xl bg-[#213979] px-6 font-semibold text-white transition hover:bg-[#182d63]"
>
  💬 Falar com um especialista
</a>

</div>

              </div>

              {/* VOLTAR */}

              <div className="mt-6 text-center">

                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm font-medium text-gray-500 hover:text-[#213979]"
                >
                  ← Revisar minhas respostas
                </button>

              </div>

            </div>
          )}

          {/* ========================= */}
          {/* NAVEGAÇÃO */}
          {/* ========================= */}

          {step <= 5 && (
            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">

              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 rounded-xl px-5 font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  ← Voltar
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 &&
                    !formData.segment) ||
                  (step === 2 &&
                    !formData.companySize) ||
                  (step === 3 &&
                    !formData.employees) ||
                  (step === 4 &&
                    (!formData.partners ||
                      !formData.partnerImpact)) ||
                  (step === 5 &&
                    formData.concerns.length === 0)
                }
                className={`h-12 rounded-xl px-6 font-semibold transition-all ${
                  (step === 1 &&
                    formData.segment) ||
                  (step === 2 &&
                    formData.companySize) ||
                  (step === 3 &&
                    formData.employees) ||
                  (step === 4 &&
                    formData.partners &&
                    formData.partnerImpact) ||
                  (step === 5 &&
                    formData.concerns.length > 0)
                    ? "bg-[#213979] text-white hover:bg-[#182d63]"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
              >
                {step === 5
                  ? "Ver meu resultado"
                  : "Continuar"}

                <span className="ml-2">
                  →
                </span>

              </button>

            </div>
          )}

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Suas informações serão utilizadas exclusivamente para esta
          simulação.
        </p>

      </section>

    </main>
  );
}