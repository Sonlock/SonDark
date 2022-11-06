function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
       xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let cometida = document.getElementById('cometida').value;
        let infractor = document.getElementById('infractor').value;
        let apellidos = document.getElementById('apellido').value;
        let email = document.getElementById('email').value;
        let reclamante = document.getElementById('reclamante').value;
        let direccion = document.getElementById('direccion').value;
        let rut = document.getElementById('rut').value;
        let telefono = document.getElementById('telefono').value;
        let inspector = document.getElementById('inspector').value;

        generatePDF(cometida, infractor, apellidos, email, reclamante, direccion, rut, telefono, inspector);
    })

});

async function generatePDF(cometida, infractor, apellidos, email, reclamante, direccion, rut, telefono, inspector) {
    const image = await loadImage("formulario.jpg");
    const signatureImage = signaturePad.toDataURL();



    const pdf = new jsPDF('p', 'pt', 'letter');

//  Fecha actual
    const date = new Date();
    pdf.setFontSize(10);
    pdf.text("Fecha:", 470, 20);
    pdf.text(date.getUTCDate()+" / "+(date.getUTCMonth() + 1)+" / "+(date.getUTCFullYear().toString()), 520, 20);

//  Titulos
    pdf.setFontSize(10);
    pdf.text("I. MUNICIPALIDAD DE LAS CONDES", 60, 20);
    pdf.text("DEPTO. SEG. CIUDADANA Y EMERGENCIA", 40, 30);

    pdf.setFontSize(20);
    pdf.text("CROQUIS DE RUIDOS MOLESTOS", 140, 80);

    pdf.addImage(image, 'PNG', 500, 170, 80, 80);
    pdf.addImage(img, 'PNG', 110, 180, 380, 400);

// TEXTO SUPERIOR
    pdf.setFontSize(12);
    pdf.text("COMETIDA EN   :", 50, 120);
    pdf.text(cometida, 150, 120);
    pdf.text("INFRACTOR       :", 50, 135);
    pdf.text(infractor, 150, 135);
    pdf.text("REP. LEGAL       :", 50, 150);
    pdf.text(apellidos, 150, 150);
    pdf.text("INFRACCION Nº :", 50, 165);
    pdf.text(email, 150, 165);

//  Firma o Imagen
    pdf.addImage(signatureImage, 'PNG', 100, 180, 400, 400);

//  TEXTO INFERIOR
    pdf.text("RECLAMANTE  :", 50, 600);
    pdf.text(reclamante, 150, 600);
    pdf.text("DIRECCION      :", 50, 615);
    pdf.text(direccion, 150, 615);
    pdf.text("RUT                   :", 50, 630);
    pdf.text(rut, 150, 630);
    pdf.text("TELEFONO :", 300, 630);
    pdf.text(telefono, 400, 630);
    pdf.text("INSPECTOR     :", 50, 645);
    pdf.text(inspector, 150, 645);

    pdf.setFillColor(0,0,0);



    pdf.save("Croquis de ruidos molestos.pdf");

}