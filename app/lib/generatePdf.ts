import jsPDF from "jspdf";

async function loadImageAsDataURL(
  src: string
): Promise<string> {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(
      `Não foi possível carregar a imagem: ${src}`
    );
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(
        new Error(
          "Erro ao converter a logo para o PDF."
        )
      );
    };

    reader.readAsDataURL(blob);
  });
}

function getImageDimensions(
  dataUrl: string
): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = reject;

    img.src = dataUrl;
  });
}

type PdfData = {
  segment: string;
  companySize: string;
  employees: string;
  partners: string;
  partnerImpact: string;
  concerns: string[];
  score: number;
  level: string;
  levelDescription: string;
  attentionPoints: string[];
  recommendations: string[];
};

export async function generateBricerPdf(
  data: PdfData
) {
  const doc = new jsPDF();

  // --------------------------------
  // LOGOS
  // --------------------------------

  const logoHeader =
    await loadImageAsDataURL(
      "/bricer-logo-branca.png"
    );

  const logoFooter =
    await loadImageAsDataURL(
      "/bricer-logo.png"
    );

  // --------------------------------
  // DIMENSÕES DAS LOGOS
  // --------------------------------

  const headerDimensions =
    await getImageDimensions(
      logoHeader
    );

  const footerDimensions =
    await getImageDimensions(
      logoFooter
    );

  const headerRatio =
    headerDimensions.height /
    headerDimensions.width;

  const footerRatio =
    footerDimensions.height /
    footerDimensions.width;

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const blue = "#213979";
  const red = "#e21414";
  const gray = "#666666";
  const lightGray = "#f4f6f9";

  let y = 20;

  // --------------------------------
  // CONTROLE DE PÁGINA
  // --------------------------------

  function addPageIfNeeded(height = 20) {
    if (
      y + height >
      pageHeight - 20
    ) {
      doc.addPage();
      y = 20;
    }
  }

  // --------------------------------
  // TÍTULO
  // --------------------------------

  function title(text: string) {
    addPageIfNeeded(20);

    doc.setTextColor(blue);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(20);

    doc.text(
      text,
      20,
      y
    );

    y += 12;
  }

  // --------------------------------
  // TÍTULO DE SEÇÃO
  // --------------------------------

  function sectionTitle(
    text: string
  ) {
    addPageIfNeeded(20);

    doc.setTextColor(blue);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(13);

    doc.text(
      text,
      20,
      y
    );

    y += 9;
  }

  // --------------------------------
  // PARÁGRAFO
  // --------------------------------

  function paragraph(
    text: string,
    width = 170
  ) {
    addPageIfNeeded(20);

    doc.setTextColor(gray);
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(10);

    const lines =
      doc.splitTextToSize(
        text,
        width
      );

    doc.text(
      lines,
      20,
      y
    );

    y +=
      lines.length * 5 + 5;
  }

  // --------------------------------
  // BULLET
  // --------------------------------

  function bullet(
    text: string
  ) {
    addPageIfNeeded(18);

    doc.setFillColor(red);

    doc.circle(
      22,
      y - 1.5,
      1.5,
      "F"
    );

    doc.setTextColor(
      "#333333"
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    const lines =
      doc.splitTextToSize(
        text,
        165
      );

    doc.text(
      lines,
      28,
      y
    );

    y +=
      lines.length * 5 + 5;
  }

  // --------------------------------
  // CABEÇALHO
  // --------------------------------

  doc.setFillColor(blue);

  doc.rect(
    0,
    0,
    pageWidth,
    42,
    "F"
  );

  // Logo branca no cabeçalho

  const headerLogoWidth = 48;

  const headerLogoHeight =
    headerLogoWidth *
    headerRatio;

  doc.addImage(
    logoHeader,
    "PNG",
    20,
    9,
    headerLogoWidth,
    headerLogoHeight
  );

  // Texto do relatório

  doc.setTextColor(
    "#ffffff"
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    "Análise de Proteção Empresarial",
    pageWidth - 20,
    24,
    {
      align: "right",
    }
  );

  y = 58;

  // --------------------------------
  // TÍTULO
  // --------------------------------

  title(
    "Seu perfil de proteção empresarial"
  );

  paragraph(
    "Esta análise foi elaborada com base nas informações fornecidas durante a simulação."
  );

  y += 5;

  // --------------------------------
  // ÍNDICE
  // --------------------------------

  addPageIfNeeded(55);

  doc.setFillColor(
    lightGray
  );

  doc.roundedRect(
    20,
    y,
    pageWidth - 40,
    42,
    5,
    5,
    "F"
  );

  doc.setTextColor(gray);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.text(
    "ÍNDICE DE ATENÇÃO",
    pageWidth / 2,
    y + 9,
    {
      align: "center",
    }
  );

  doc.setTextColor(blue);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(28);

  doc.text(
    `${data.score}/100`,
    pageWidth / 2,
    y + 24,
    {
      align: "center",
    }
  );

  doc.setTextColor(red);

  doc.setFontSize(12);

  doc.text(
    data.level,
    pageWidth / 2,
    y + 34,
    {
      align: "center",
    }
  );

  y += 55;

  paragraph(
    data.levelDescription
  );

  // --------------------------------
  // PERFIL DA EMPRESA
  // --------------------------------

  sectionTitle(
    "Perfil da empresa"
  );

  const profile = [
    [
      "Segmento",
      data.segment,
    ],
    [
      "Porte",
      data.companySize,
    ],
    [
      "Funcionários",
      data.employees,
    ],
    [
      "Sócios",
      data.partners,
    ],
  ];

  profile.forEach(
    ([label, value]) => {
      addPageIfNeeded(14);

      doc.setTextColor(
        gray
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.text(
        label,
        20,
        y
      );

      doc.setTextColor(
        "#222222"
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(10);

      doc.text(
        value,
        75,
        y
      );

      y += 8;
    }
  );

  y += 5;

  // --------------------------------
  // PONTOS DE ATENÇÃO
  // --------------------------------

  sectionTitle(
    "Principais pontos de atenção"
  );

  if (
    data.attentionPoints
      .length === 0
  ) {
    paragraph(
      "Não foram identificados pontos críticos com base nas respostas fornecidas."
    );
  } else {
    data.attentionPoints.forEach(
      (point) => {
        bullet(point);
      }
    );
  }

  y += 5;

  // --------------------------------
  // RECOMENDAÇÕES
  // --------------------------------

  sectionTitle(
    "Recomendações"
  );

  data.recommendations.forEach(
    (recommendation) => {
      bullet(
        recommendation
      );
    }
  );

  y += 5;

  // --------------------------------
  // PREOCUPAÇÕES
  // --------------------------------

  sectionTitle(
    "Principais preocupações selecionadas"
  );

 data.concerns.forEach(
  (concern) => {
    bullet(
      concern
    );
  }
);

y += 10;

// --------------------------------
// CTA WHATSAPP
// --------------------------------

addPageIfNeeded(45);

doc.setFillColor(blue);

doc.roundedRect(
  20,
  y,
  pageWidth - 40,
  30,
  5,
  5,
  "F"
);

doc.setTextColor("#ffffff");

doc.setFont(
  "helvetica",
  "bold"
);

doc.setFontSize(12);

doc.text(
  "Falar com um especialista",
  pageWidth / 2,
  y + 12,
  {
    align: "center",
  }
);

doc.setFont(
  "helvetica",
  "normal"
);

doc.setFontSize(8);

doc.text(
  "Clique aqui para falar com a equipe Bricer pelo WhatsApp",
  pageWidth / 2,
  y + 21,
  {
    align: "center",
  }
);

// Link clicável sobre o botão

doc.link(
  20,
  y,
  pageWidth - 40,
  30,
  {
    url: "https://wa.me/5521969145990?text=Ol%C3%A1!%20Eu%20fiz%20uma%20simula%C3%A7%C3%A3o%20de%20prote%C3%A7%C3%A3o%20empresarial(sistema%20Bricer%20Company)%20e%20gostaria%20de%20um%20suporte",
  }
);

y += 42;

  // --------------------------------
  // RODAPÉ FINAL
  // --------------------------------

  addPageIfNeeded(55);

  doc.setDrawColor(
    "#dddddd"
  );

  doc.line(
    20,
    y,
    pageWidth - 20,
    y
  );

  y += 10;

  // Logo azul no rodapé

  const footerLogoWidth = 42;

  const footerLogoHeight =
    footerLogoWidth *
    footerRatio;

  doc.addImage(
    logoFooter,
    "PNG",
    20,
    y - 5,
    footerLogoWidth,
    footerLogoHeight
  );

  y +=
    footerLogoHeight + 5;

  // Disclaimer

  doc.setTextColor(gray);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8);

  const disclaimer =
    "Esta análise tem caráter informativo e representa uma avaliação inicial baseada nas informações fornecidas durante a simulação. Ela não substitui uma análise personalizada realizada por um especialista.";

  const disclaimerLines =
    doc.splitTextToSize(
      disclaimer,
      170
    );

  doc.text(
    disclaimerLines,
    20,
    y
  );

  // --------------------------------
  // NUMERAÇÃO DAS PÁGINAS
  // --------------------------------

  const totalPages =
    doc.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    doc.setPage(page);

    doc.setTextColor(
      "#999999"
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    doc.text(
      `Bricer Company • Página ${page} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      {
        align: "center",
      }
    );
  }

  // --------------------------------
  // DOWNLOAD
  // --------------------------------

  doc.save(
    `bricer-company-analise-${Date.now()}.pdf`
  );
}