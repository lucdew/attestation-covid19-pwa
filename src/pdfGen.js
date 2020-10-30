import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import pdfBase from "./30-10-2020-attestation-de-deplacement-derogatoire.pdf";

async function generateQR(text) {
  try {
    var opts = {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
    };
    return await QRCode.toDataURL(text, opts);
  } catch (err) {
    console.error(err);
  }
}

export default async function pdfGen(reasons, timeShiftInMin = 45) {
  console.log("Generating pdf=" + reasons);
  console.log(pdfBase);
  const certBytes = await fetch(pdfBase).then((res) => res.arrayBuffer());
  console.log("certBytes res" + certBytes.byteLength);

  const pdfDoc = await PDFDocument.load(certBytes);
  const page1 = pdfDoc.getPages()[0];
  console.log(page1.getHeight());
  console.log(page1.getWidth());
  console.log("Done loading");

  const config = localStorage.getItem("config");
  const {
    firstName,
    lastName,
    cityOfBirth,
    dateOfBirth,
    address,
    city,
    zipCode,
  } = JSON.parse(config);

  const releaseDate = new Date();
  releaseDate.setMinutes(releaseDate.getMinutes() + timeShiftInMin);

  const creationDate = releaseDate.toLocaleDateString("fr-FR");
  const creationHour = releaseDate
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");
  const dateOfBirthFormatted = new Date(dateOfBirth).toLocaleDateString(
    "fr-FR"
  );
  const releaseHours = creationHour.substring(0, 2);
  const releaseMinutes = creationHour.substring(3, 5);

  const data = [
    `Cree le: ${creationDate} a ${creationHour};`,
    `Nom: ${lastName};`,
    `Prenom: ${firstName};`,
    `Naissance: ${dateOfBirthFormatted} a ${cityOfBirth};`,
    `Adresse: ${address} ${zipCode} ${city};`,
    `Sortie: ${creationDate} a ${releaseHours}h${releaseMinutes};`,
    `Motifs: ${reasons.join("-")}`,
  ].join("; ");
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size /*, font */ });
  };

  drawText(`${firstName} ${lastName}`, 118, 696);
  drawText(dateOfBirthFormatted, 118, 674);
  drawText(cityOfBirth, 297, 674);
  drawText(`${address} ${zipCode} ${city}`, 134, 653);

  if (reasons.includes("travail")) {
    drawText("x", 84, 578, 19);
  }
  if (reasons.includes("courses")) {
    drawText("x", 84, 532, 19);
  }
  if (reasons.includes("sante")) {
    drawText("x", 84, 477, 19);
  }
  if (reasons.includes("famille")) {
    drawText("x", 84, 436, 19);
  }
  if (reasons.includes("sport")) {
    drawText("x", 84, 356, 19);
  }
  if (reasons.includes("enfants")) {
    drawText("x", 84, 207, 19);
  }
  drawText(city, 105, 176);

  drawText(creationDate, 90, 153);
  drawText(`${releaseHours}:${releaseMinutes}`, 262, 153);

  /* 
  drawText("Date de création:", 464, 150, 7);
  drawText(`${creationDate} à ${creationHour}`, 455, 144, 7); */

  const generatedQR = await generateQR(data);

  const qrImage = await pdfDoc.embedPng(generatedQR);

  page1.drawImage(qrImage, {
    x: 440,
    y: 111,
    width: 100,
    height: 100,
  });

  pdfDoc.addPage();
  const page2 = pdfDoc.getPages()[1];
  page2.drawImage(qrImage, {
    x: 50,
    y: page2.getHeight() - 350,
    width: 300,
    height: 300,
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const fileNameDate = releaseDate.toLocaleDateString("fr-CA");
  const fileNameHour = releaseDate
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "-");
  link.href = url;
  link.download = `attestation-${fileNameDate}_${fileNameHour}.pdf`;
  document.body.appendChild(link);
  link.click();
}
