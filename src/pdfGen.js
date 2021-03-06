import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import pdfBase from "./certificate.33362af4.pdf";

import constants from "./constants";

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

export default async function pdfGen(
  reasons,
  timeShiftInMin = 45,
  fileNameSuffix = ""
) {
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
    `Motifs: ${reasons.join(" ,")}`,
  ].join("; ");
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size /*, font */ });
  };

  drawText(`${firstName} ${lastName}`, 144, 705);
  drawText(dateOfBirthFormatted, 144, 684);
  drawText(cityOfBirth, 310, 684);
  drawText(`${address} ${zipCode} ${city}`, 148, 665);

  for (const r of constants.reasons) {
    if (reasons.includes(r.name)) {
      drawText("x", 72, r.ypos, 12);
    }
  }
  drawText(city, 103, 112);

  drawText(creationDate, 91, 95);
  drawText(`${releaseHours}:${releaseMinutes}`, 310, 95);

  /* 
  drawText("Date de création:", 464, 150, 7);
  drawText(`${creationDate} à ${creationHour}`, 455, 144, 7); */

  const generatedQR = await generateQR(data);

  const qrImage = await pdfDoc.embedPng(generatedQR);

  page1.drawImage(qrImage, {
    x: 488.32,
    y: 660,
    width: 82,
    height: 82,
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
  link.download = `attestation-${fileNameDate}_${fileNameHour}${fileNameSuffix}.pdf`;
  document.body.appendChild(link);
  link.click();
}
