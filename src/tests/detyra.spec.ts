import { test, expect, chromium, firefox, webkit } from '@playwright/test';


//Testi i pare kryesisht per funksionimin e butonave,formave.
test('Testi 1: Plotësimi i formës për veturën', async ({ page }) => {
  // Hap faqen
  await page.goto('https://kselsig.com/');

  await page.waitForTimeout(2000);

  // Kliko butonin "Lexo më shumë"
  await page.getByRole('link', { name: 'lexo më shumë' }).nth(3).click();
  await page.waitForTimeout(2000);

  // Plotëso fushat e formës
  const emri = page.locator('input[name="emri"]');
  await emri.fill('Pashtrik Zogaj');
  await page.locator('input[name="nrTelefonit"]').fill('+38349180538');
  await page.locator('input[name="email"]').fill('zogajpashtrik@gmail.com');
  await page.locator('input[name="modeliVetures"]').fill('IT Service');
  await page.locator('input[name="vleraVetures"]').fill('20');
  await page.locator('textarea[name="koment"]').fill('Jo nuk kam.');

  // Kliko butonin "Dërgo të dhënat"
  await page.getByRole('button', { name: 'Dërgo të dhënat' }).click();

  // Prisni disa sekonda për të parë efektin
  await page.waitForTimeout(2000);

  // Kontrollo nëse fusha është bosh pas klikimit
  await expect(emri).toHaveValue('');
});


//Ky test deshton shkaku qe captcha nuk mbeshtet testet automatike.Ky test eshte nje test qe i bbehet 
//si lloj register ose log in form meqense elsig nuk ka register dhe log in form
test.skip('Testi 2: Plotësimi i formës së ankesave', async ({ page }) => {
  // Hape faqen dhe prit pak për ngarkim
  await page.goto('https://kselsig.com/');
  await page.waitForTimeout(2000);

  // Kliko në 'Ankesa'
  await page.getByRole('link', { name: 'Ankesa' }).click();
  await page.waitForTimeout(1000);

  // Plotëso fushat e formularit
  const formData = [
    { name: 'emri', value: 'Pashtrik' },
    { name: 'mbiemri', value: 'Zogaj' },
    { name: 'nrPersonal', value: '1248090123' },
    { name: 'adresa', value: 'Ulpiane' },
    { name: 'qyteti', value: 'Prishtine' },
    { name: 'nrTelefonit', value: '1234123456' },
    { name: 'email', value: 'pashtrik.zogaj@student.uni-pr.edu' },
    { name: 'perfaqesuesi_emri', value: 'NPT Shpk' },
    { name: 'perfaqesuesi_mbiemri', value: 'Zogaj' },
    { name: 'perfaqesuesi_nrPersonal', value: '00099988' },
    { name: 'perfaqesuesi_adresa', value: 'Prishtine' },
    { name: 'perfaqesuesi_qyteti', value: 'Prishtine' },
    { name: 'perfaqesuesi_nrTelefonit', value: '235474960' },
    { name: 'perfaqesuesi_email', value: 'pashtrik.zogaj@student.uni-pr.edu' }
  ];

  for (const field of formData) {
    await page.locator(`input[name="${field.name}"]`).fill(field.value);
    await page.waitForTimeout(500);
  }

  // Plotëso fushat e përshkrimeve
  
const descriptions = [
  { name: 'pershkrimiAnkeses', value: 'Ankese per jo korrektesi' },
  { name: 'pershkrimiDemit', value: 'Rast Zjarri' },
  { name: 'komenteTjera', value: 'Jo' }
];

  for (const desc of descriptions) {
    await page.locator(`textarea[name="${desc.name}"]`).fill(desc.value);
    await page.waitForTimeout(500);
  }

  // Prano termat dhe kushtet
  await page.locator('#acceptTerms').check();
  await page.waitForTimeout(1000);

 // If the span is directly on the page
//await page.locator('span.cb-i').click();





  // Kliko butonin për të dërguar formularin
  await page.getByRole('button', { name: 'Dërgo mesazhin' }).click();

 

});



//Ky test vetem e bene nje verifikim te linkut 
test('Verifikimi i linkut', async ({ page }) => {
  await page.goto('https://kselsig.com/'); // Hape faqen kryesore
  const link = await page.getByRole('link', { name: 'APSIG' });

  if (await link.isVisible()) {
    await link.click(); // Kliko linkun
    await page.waitForTimeout(2000); // Prit pak për të parë nëse hapet faqja e re

    // Merr URL-në e faqes aktive pas klikimit
    const newPageURL = page.url(); 

    // Printo në terminal për të treguar se linku është klikuar
    console.log(`Klikova linkun, por u hap një faqe me këtë URL: ${newPageURL}`);
  } else {
    console.log("Gabim: Linku 'APSIG' nuk u gjet!");
  }
});









//Ky test verifikon qe hapet nje faqe tjeter(outlook-i)dhe verfikon funksionimin e linkut
test('Verifikimi i linkut te emailit', async ({ page }) => {
  await page.goto('https://kselsig.com/');
  await page.waitForTimeout(2000);

  // Bëj scroll në fund të faqes për të zbuluar linkun mailto
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  // Gjej të gjithë linkët mailto
  const mailtoLinks = await page.locator('a[href^="mailto:"]').all();

  // Printo të gjithë linkët e gjetur për të parë nëse është ai që dëshiron
  for (const link of mailtoLinks) {
    const href = await link.getAttribute('href');
    console.log('📩 Link mailto i gjetur:', href);
  }

  // Gjej linkun 'mailto:office@kselsig.com'
  const mailtoLink = mailtoLinks.find(async (link) => 
    (await link.getAttribute('href')) === 'mailto:office@kselsig.com'
  );

  // Kontrollo që linku ekziston
  expect(mailtoLink).not.toBeNull();

  // Kliko linkun
  if (mailtoLink) {
    await mailtoLink.click();
  }
});







//Ky test verfikon validimin ndermjet faqeve renda Elsig
test('Navigimi ndermjet faqeve', async ({ page }) => {
  await page.goto('https://kselsig.com/');
  console.log('✅ U hap faqja kryesore.');

  // Bëj scroll ngadalë deri në fund të faqes
  await page.evaluate(async () => {
    const distance = 100;
    const delay = 50;
    const scrollHeight = document.body.scrollHeight;
    
    for (let i = 0; i < scrollHeight; i += distance) {
      window.scrollBy(0, distance);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  });
  console.log('✅ U bë scroll ngadalë deri në fund të faqes.');
  await page.waitForTimeout(2000);

  // Kthehuni ngadalë në fillim të faqes
  await page.evaluate(async () => {
    const distance = 100;
    const delay = 50;
    
    for (let i = document.body.scrollHeight; i > 0; i -= distance) {
      window.scrollBy(0, -distance);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  });
  console.log('✅ U bë scroll ngadalë deri në fillim të faqes.');
  await page.waitForTimeout(2000);

  // Kliko në 'Për ne' dhe kontrollo që "Mirësevini në Elsig" shfaqet
  await page.getByRole('link', { name: 'Për ne' }).first().click();
  console.log('✅ Klikoi në "Për ne".');
  await page.waitForTimeout(2000);
  await page.getByText('Mirësevini në Elsig').click();
  console.log('✅ Shfaqet "Mirësevini në Elsig".');
  await page.waitForTimeout(2000);

  // Kliko në 'Zyrat e shitjes' dhe kontrollo që "Zyra e shitjes" shfaqet
  await page.getByRole('link', { name: 'Zyrat e shitjes' }).click();
  console.log('✅ Klikoi në "Zyrat e shitjes".');
  await page.waitForTimeout(2000);
  await page.getByText('Zyra e shitjes').click();
  console.log('✅ Shfaqet "Zyra e shitjes".');
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Shtrirja e zyreve të shitjes' }).click();
  console.log('✅ Shfaqet "Shtrirja e zyreve të shitjes".');
  await page.waitForTimeout(2000);

  // Kliko në 'Kontakti'
  await page.getByRole('link', { name: 'Kontakti' }).first().click();
  console.log('✅ Klikoi në "Kontakti".');
  await page.waitForTimeout(2000);

  // Kliko në 'Ankesa' dhe kontrollo që "Forma për ankesë" shfaqet
  await page.getByRole('link', { name: 'Ankesa' }).click();
  console.log('✅ Klikoi në "Ankesa".');
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Forma për ankesë' }).click();
  console.log('✅ Shfaqet "Forma për ankesë".');
  await page.waitForTimeout(2000);

  // Kliko në 'Pyetjet e shpeshta' dhe kontrollo që "Pyetje të përgjithshme" shfaqet
  await page.getByRole('link', { name: 'Pyetjet e shpeshta' }).click();
  console.log('✅ Klikoi në "Pyetjet e shpeshta".');
  await page.waitForTimeout(2000);

  // Kliko në 'Pse duhet të sigurohemi?'
  await page.getByRole('link', { name: 'Pse duhet të sigurohemi?' }).click();
  console.log('✅ Klikoi në "Pse duhet të sigurohemi?".');
  await page.waitForTimeout(2000);
});






//Edhe nje verfikim i linkut dhe gjithashtu verfikon nje lehtesi te perdorimit
test('verifikimi i linkut', async ({ page }) => {
  await page.goto('https://kselsig.com/');
  console.log('✅ U hap faqja kryesore.');
  await page.waitForTimeout(2000); // Prit 2 sekonda pas hapjes së faqes

  // Bëj scroll të vogël (1-2 herë) para se të klikohet në link
  await page.evaluate(async () => {
    window.scrollBy(0, 400); // Scroll 100px poshtë
  });
  console.log('✅ U bë scroll i vogël.');
  await page.waitForTimeout(2000); // Prit 2 sekonda pas scroll-it

  // Kliko në "PYETËSORI PËR SIGURIM SHËNDET"
  await page.getByRole('link', { name: 'PYETËSORI PËR SIGURIM SHËNDET' }).click();
  console.log('✅ Klikoi në "PYETËSORI PËR SIGURIM SHËNDET".');
  await page.waitForTimeout(2000); // Prit 2 sekonda pas klikimit
});



//Me nje test te vogel nje lehtesi te persorimit te  faqes
test('Testimi i lehtësisë së përdorimit', async ({ page }) => {
  await page.goto('https://kselsig.com/');
  await page.waitForTimeout(2000); // Prit 2 sekonda pas hapjes së faqes

  // Merr linkun e parë me emrin "Për ne"
  const butoniPerNe = await page.getByRole('link', { name: 'Për ne' }).first(); //faqja a dy per ne
  // dhe perdore .first per te treguar se te klikoj tek butoni per ne i pari qe shfaqet pasi qe edhe nje per ne eshte ne footer

  expect(await butoniPerNe.isVisible()).toBeTruthy(); // Duhet të jetë i dukshëm
  await page.waitForTimeout(2000); // Prit 2 sekonda para klikimit

  await butoniPerNe.click();
  console.log('✅ Klikoi me sukses në "Për ne".');
  await page.waitForTimeout(2000); // Prit 2 sekonda pas klikimit

  // Kontrollo nëse është hapur faqja e duhur
  await expect(page).toHaveURL(/per_ne/);
  console.log('✅ Navigimi funksionon siç duhet.');
});




//Ky test UL/UX tregon se butoni per ne nuk zhduket,nuk ndryshohet funksioni i tij edhe pasi
//te ndryshohet formati i faqes
test('Testimi i konsistencës së dizajnit', async ({ page }) => {
  // Hape faqen dhe presi deri sa të ngarkohen të gjitha elementet
  await page.goto('https://kselsig.com/', { timeout: 6000 }); // Rritëm timeout për ngarkim
  await page.waitForSelector('a[href="per_ne"]', { timeout: 5000 }); // Prit deri sa të jetë i disponueshëm linku 'Për ne'

  // Merr linkun e parë me emrin "Për ne"
  const butoniPërNe = await page.getByRole('link', { name: 'Për ne' }).first();

  // Kontrollo që butoni është i dukshëm dhe funksional
  expect(await butoniPërNe.isVisible()).toBeTruthy();
  await butoniPërNe.click({ timeout: 5000 }); // 5 sekonda timeout për klikim

  // Kontrollo nëse faqja e duhur hapet
  await expect(page).toHaveURL(/per_ne/, { timeout: 3000 }); // 3 sekonda timeout për kontrollin e URL-së

  // Testo dizajnin në përgjigje
  await page.setViewportSize({ width: 375, height: 667 }); // Rregullimi i pamjes për celular
  await page.waitForTimeout(10000); // Pritje për 2 sekonda pas ndryshimit të pamjes
  const butoniMobil = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await butoniMobil.isVisible()).toBeTruthy();

  console.log('✅ Dizajni është konsistent dhe përgjigjës.');
});










//Test per shfletues te ndryshem
test.describe.parallel('Testimi në shfletues të ndryshëm', () => {

  test('Testimi në Chrome', async () => {
    const browser = await chromium.launch(); // Start Chrome
    const page = await browser.newPage();
    await page.goto('https://kselsig.com/');
    await page.waitForTimeout(10000);

    // Shtoni testet që duhet të ekzekutohen në Chrome
    const butoniPerNe = await page.getByRole('link', { name: 'Për ne' }).first();
    expect(await butoniPerNe.isVisible()).toBeTruthy();
    await butoniPerNe.click();
    await expect(page).toHaveURL(/per_ne/);

    await browser.close();
  });

  test('Testimi në Firefox', async () => {
    const browser = await firefox.launch(); // Start Firefox
    const page = await browser.newPage();
    await page.goto('https://kselsig.com/');
    await page.waitForTimeout(10000);

    // Shtoni testet që duhet të ekzekutohen në Firefox
    const butoniPerNe = await page.getByRole('link', { name: 'Për ne' }).first();
    expect(await butoniPerNe.isVisible()).toBeTruthy();
    await butoniPerNe.click();
    await expect(page).toHaveURL(/per_ne/);

    await browser.close();
  });

  test('Testimi në Safari (WebKit)', async () => {
    const browser = await webkit.launch(); // Start Safari (WebKit)
    const page = await browser.newPage();
    await page.goto('https://kselsig.com/');
    await page.waitForTimeout(10000);

    // Shtoni testet që duhet të ekzekutohen në Safari
    const butoniPerNe = await page.getByRole('link', { name: 'Për ne' }).first();
    expect(await butoniPerNe.isVisible()).toBeTruthy();
    await butoniPerNe.click();
    await expect(page).toHaveURL(/per_ne/);

    await browser.close();
  });

});








// Testimi per madhesi te ndryshme te ekranit
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('Testimi në pajisje me madhësi të ndryshme të ekranit', async ({ page }) => {
  // Hape faqen dhe përdor timeout për ngarkimin e faqes
  await page.goto('https://kselsig.com/', { timeout: 3000 }); // 5 sekonda timeout për ngarkimin e faqes
  await delay(2000); // 2 sekonda vonesë për t'u siguruar që faqja është ngarkuar plotësisht

  // Testimi në Desktop (Madhësia e ekranit: 1920x1080)
  await page.setViewportSize({ width: 1920, height: 1080 });
  await delay(3000); // 2 sekonda vonesë për të dhënë kohë për të aplikuar madhësinë
  console.log('Testimi në Desktop...');
  const buttonDesktop = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await buttonDesktop.isVisible(), 'Butoni nuk është i dukshëm në desktop').toBeTruthy();
  await buttonDesktop.click({ timeout: 5000 }); // 5 sekonda timeout për klikim
  await expect(page).toHaveURL(/per_ne/, { timeout: 5000 }); // 5 sekonda timeout për kontrollin e URL-së
  await delay(2000); // 2 sekonda vonesë pas klikimit

  // Testimi në Tablet (Madhësia e ekranit: 768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await delay(3000); // 2 sekonda vonesë për të dhënë kohë për të aplikuar madhësinë
  console.log('Testimi në Tablet...');
  const buttonTablet = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await buttonTablet.isVisible(), 'Butoni nuk është i dukshëm në tablet').toBeTruthy();
  await buttonTablet.click({ timeout: 5000 }); // 5 sekonda timeout për klikim
  await expect(page).toHaveURL(/per_ne/, { timeout: 5000 }); // 5 sekonda timeout për kontrollin e URL-së
  await delay(2000); // 2 sekonda vonesë pas klikimit

  // Testimi në Smartphone (Madhësia e ekranit: 375x667)
  await page.setViewportSize({ width: 375, height: 667 });
  await delay(3000); // 2 sekonda vonesë për të dhënë kohë për të aplikuar madhësinë
  console.log('Testimi në Smartphone...');
  const buttonMobile = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await buttonMobile.isVisible(), 'Butoni nuk është i dukshëm në smartphone').toBeTruthy();
  await buttonMobile.click({ timeout: 5000 }); // 5 sekonda timeout për klikim
  await expect(page).toHaveURL(/per_ne/, { timeout: 5000 }); // 5 sekonda timeout për kontrollin e URL-së
  await delay(2000); // 2 sekonda vonesë pas klikimit

  console.log('✅ Testimi për pajisje të ndryshme është i suksesshëm.');
});



//Pershtatja e faqes ne madhesi te ndryshme te ekranit
test('Testimi Responzivitetit', async ({ page }) => {
  // Hape faqen
  await page.goto('https://kselsig.com/', { timeout: 5000 });

  // Testimi në Desktop (Madhësia e ekranit: 1920x1080)
  await page.setViewportSize({ width: 1920, height: 1080 });
  console.log('Testimi në Desktop...');
  await page.waitForTimeout(2000); // Shtoni një vonesë prej 2 sekondash
  const buttonDesktop = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await buttonDesktop.isVisible(), 'Butoni nuk është i dukshëm në desktop').toBeTruthy();
  await buttonDesktop.click({ timeout: 4000 });
  await expect(page).toHaveURL(/per_ne/, { timeout: 4000 });

  // Testimi në Tablet (Madhësia e ekranit: 768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  console.log('Testimi në Tablet...');
  await page.waitForTimeout(2000); // Shtoni një vonesë prej 2 sekondash
  const buttonTablet = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await buttonTablet.isVisible(), 'Butoni nuk është i dukshëm në tablet').toBeTruthy();
  await buttonTablet.click({ timeout: 4000 });
  await expect(page).toHaveURL(/per_ne/, { timeout: 4000 });

  // Testimi në Smartphone (Madhësia e ekranit: 375x667)
  await page.setViewportSize({ width: 375, height: 667 });
  console.log('Testimi në Smartphone...');
  await page.waitForTimeout(2000); // Shtoni një vonesë prej 2 sekondash
  const buttonMobile = await page.getByRole('link', { name: 'Për ne' }).first();
  expect(await buttonMobile.isVisible(), 'Butoni nuk është i dukshëm në smartphone').toBeTruthy();
  await buttonMobile.click({ timeout: 4000 });
  await expect(page).toHaveURL(/per_ne/, { timeout: 4000 });

  console.log('✅ Testimi i dizajnit përgjigjës është i suksesshëm.');
});




//Nje verifikim qe faqja pavaresisht buttonit per perkthim nuk ka arritur te beje perkthimin
test('Verifikimi që butoni "English" nuk bën përkthim', async ({ page }) => {
  // Hape faqen
  await page.goto('https://kselsig.com/');

  // Merr tekstin origjinal në gjuhën që është aktualisht
  const tekstOrigjinal = await page.textContent('body'); // Mund të përshtatet për elemente specifikë të faqes

  // Kliko në butonin 'Gjuhët'
  await page.getByText('Gjuhët').click();

  // Kliko në butonin 'English'
  await page.getByRole('link', { name: 'English' }).click();

  // Prit pak kohë që të ndodhi përkthimi
  await page.waitForTimeout(2000); // 2 sekonda për të pasur mundësi që përkthimi të ndodhë

  // Merr tekstin pas klikut
  const tekstPasKlikimit = await page.textContent('body'); // Mund të përshtatet për elemente specifikë të faqes

  // Verifikoni që përmbajtja nuk ka ndryshuar
  expect(tekstOrigjinal).toBe(tekstPasKlikimit);

  console.log('✅ Testi dështoi sepse përkthimi nuk ndodhi!');
});



//Nje test qe deshmon shpejtesin e ngarkimit te faqeve 
test('Testimi i shpejtësisë së ngarkimit të faqes kryesore', async ({ page }) => {
  const startTime = Date.now(); // Merr kohën e fillimit

  // Hape faqen e kryesore
  await page.goto('https://kselsig.com/', { waitUntil: 'load' });

  const endTime = Date.now(); // Merr kohën e përfundimit
  const loadTime = endTime - startTime; // Llogarit kohën e ngarkimit

  console.log(`Kohë ngarkimi: ${loadTime} ms`); // Shfaq kohën e ngarkimit në ms

  // Përcakto një kufi maksimal të pranueshëm për ngarkimin, p.sh. 5000 ms (5 sekonda)
  expect(loadTime).toBeLessThan(5000); // Verifikoni që koha e ngarkimit të jetë më e vogël se 5000 ms
});




test.only('Testimi i shpejtësisë së ngarkimit të faqes kryesore dhe faqeve të tjera', async ({ page }) => {
  // Funksion për të matur kohën e ngarkimit
  const measureLoadTime = async (url) => {
    const startTime = Date.now(); // Merr kohën e fillimit
    await page.goto(url, { waitUntil: 'load' }); // Ngarko faqen dhe presim që të jetë ngarkuar plotësisht
    const endTime = Date.now(); // Merr kohën e përfundimit
    return endTime - startTime; // Llogarit kohën e ngarkimit
  };

  // Testo ngarkimin e faqes kryesore
  const homePageLoadTime = await measureLoadTime('https://kselsig.com/');
  console.log(`Kohë ngarkimi për faqen kryesore: ${homePageLoadTime} ms`);
  expect(homePageLoadTime).toBeLessThan(5000); // Verifikoni që koha e ngarkimit të jetë më e vogël se 5000 ms

  // Testo ngarkimin e një faqe tjetër (p.sh., faqja "Për ne")
  const aboutPageLoadTime = await measureLoadTime('https://kselsig.com/per-ne');
  console.log(`Kohë ngarkimi për faqen "Për ne": ${aboutPageLoadTime} ms`);
  expect(aboutPageLoadTime).toBeLessThan(5000); // Verifikoni që koha e ngarkimit të jetë më e vogël se 5000 ms

  // Testo ngarkimin e një faqe tjetër (p.sh., faqja "Shërbimet")
  const servicesPageLoadTime = await measureLoadTime('https://kselsig.com/shërbimet');
  console.log(`Kohë ngarkimi për faqen "Shërbimet": ${servicesPageLoadTime} ms`);
  expect(servicesPageLoadTime).toBeLessThan(5000); // Verifikoni që koha e ngarkimit të jetë më e vogël se 5000 ms

  // Testo ngarkimin e një faqe tjetër (p.sh., faqja "Kontakt")
  const contactPageLoadTime = await measureLoadTime('https://kselsig.com/kontakt');
  console.log(`Kohë ngarkimi për faqen "Kontakt": ${contactPageLoadTime} ms`);
  expect(contactPageLoadTime).toBeLessThan(5000); // Verifikoni që koha e ngarkimit të jetë më e vogël se 5000 ms
});

