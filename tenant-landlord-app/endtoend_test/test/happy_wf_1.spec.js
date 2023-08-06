const {By, Builder, Browser, until} = require('selenium-webdriver');
const chai = require('chai');

const assert = chai.assert;

describe('Successful/Usual Service Ticket Workflow', function () {
    let tenant_driver;
    let landlord_driver

    before(async function () {
      tenant_driver = await new Builder().forBrowser('chrome').build();
      landlord_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {await tenant_driver.quit(); await landlord_driver.quit()});


    it('Select Tenant Option', async function () {
        await tenant_driver.get('http://localhost:3000/');
  
        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);
  
        // In first page
        let tenantButton = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/div/button[1]'))));
        await tenantButton.click();
  
        // In Tenant Login Page
        let loginText = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2"))));
        let result = await loginText.getText();
        assert.equal("Welcome tenant!", result);
      });
    

    it('Tenant login', async function () {
  
        // Sign in details: email, password, button
        let email_in = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="email"]'))));
        await email_in.sendKeys('tenant1@gmail.com');
  
        let pw_in = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@type="password"]'))));
        await pw_in.sendKeys('password');
  
        let submit_button = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@type="submit"]'))));
        await submit_button.click();
  
         await tenant_driver.manage().setTimeouts({implicit: 1000});
  
        // In Tenant Dashboard
        let next_pg = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="emailText"]'))));
        let result = await next_pg.getText();
        assert.equal("Welcome, tenant1@gmail.com", result);
      });


    it('Tenant Create Service Ticket', async function() {

        // Click on "Create Service Ticket"
        let create_service_ticket = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
        ))
        await create_service_ticket.click();
  
  
        await tenant_driver.manage().setTimeouts({implicit: 1000});
  
        // Request Type
        let req_type = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@name="requestType"]'))
        ));
        await req_type.click();
        let sel_dropdown= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath(`//select[@name="requestType"]/option[2]`))
        ));
        await sel_dropdown.click();
  
        // Request Description
        let description= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="tenantComment"]'))
        ));
        await description.sendKeys("Aircon is not cold");
  
        await tenant_driver.executeScript("window.scrollBy(0,250)", "");
  
        // Submit Button
        let submit= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@name="submitButton"]'))
        ));
        await submit.click();
          
        await tenant_driver.sleep(1000)
        await tenant_driver.manage().setTimeouts({implicit: 2000});
  
        // Check if it enters dashboard again
        const currentURL = await tenant_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/Dashboard', currentURL)
        });

    it('Select Landlord Option', async function () {
        await landlord_driver.get('http://localhost:3000/');
      
        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);
      
        // In first page
        let landlordButton = await landlord_driver.wait(until.elementIsVisible(
            landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]"))));
        await landlordButton.click();
      
         // In Landlord Login Page
         let loginText = await landlord_driver.wait(until.elementIsVisible(
             landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/h2'))));
         let result = await loginText.getText();
         assert.equal("Welcome landlord!", result);
          });
    
    it('Landlord login', async function () {
      
        // Sign in details: email, password, button
        let email_in = await landlord_driver.wait(until.elementIsVisible(
          landlord_driver.findElement(By.xpath('//*[@id="email"]'))));
        await email_in.sendKeys('landlord1@gmail.com');
    
        let pw_in = await landlord_driver.wait(until.elementIsVisible(
        landlord_driver.findElement(By.xpath('//*[@type="password"]'))));
        await pw_in.sendKeys('password');
      
        let submit_button = await landlord_driver.wait(until.elementIsVisible(
          landlord_driver.findElement(By.xpath('//*[@type="submit"]'))));
        await submit_button.click();
      
        await landlord_driver.manage().setTimeouts({implicit: 1000});
      
        // In Landlord Dashboard
        let next_pg = await landlord_driver.wait(until.elementIsVisible(
          landlord_driver.findElement(By.xpath('//*[@id="emailText"]'))));
        let result = await next_pg.getText();
        assert.equal("Welcome, landlord1@gmail.com", result);
        });

    it('Landlord View Service Tickets', async function () {
        // Click on "Service Ticket List"
        let ticket_list = await landlord_driver.wait(until.elementIsVisible(
        landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[3]/a'))
      ))
      await ticket_list.click();
  
      // Check if ticket portal is shown
      const currentURL = await landlord_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    });

    
    it('Landlord Select Service Ticket', async function () {
      // Find ticket
      const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
      await landlord_driver.executeScript("arguments[0].click();", lastTicket);
      // Click on "details" button
      const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
      await landlord_driver.executeScript("arguments[0].click();", detailsButton);

      // // View drop down box
      // let lastTicket = await landlord_driver.wait(until.elementIsVisible(
      //   landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
      // ));
      // await landlord_driver.executeScript("arguments[0].click();", lastTicket)
      // // await landlord_driver.sleep(2000)
      // // await lastTicket.click()
      // // await landlord_driver.executeScript("arguments[0].click();", lastTicket)

      // // Click "View Details& Actions" Button
      // let detailsButton = await landlord_driver.wait(until.elementIsVisible(
      //   landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
      // ));
      // await landlord_driver.executeScript("arguments[0].click();", detailsButton);

      // Enter new page
      let currentURL = await landlord_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)
    });


    it("Landlord Approve Service Ticket", async function() {
      await tenant_driver.manage().setTimeouts({implicit: 300});

      let quotationCheckbox = await landlord_driver.wait(until.elementIsVisible(
        landlord_driver.findElement(By.xpath("//*[@id='quotationCheckbox']"))
      ));
      let approveButton = await landlord_driver.wait(until.elementIsVisible(
        landlord_driver.findElement(By.xpath("//button[text()='Approve Ticket']"))
      ));

      await landlord_driver.executeScript("arguments[0].click();", quotationCheckbox);
      await landlord_driver.executeScript("arguments[0].click();", approveButton);

      await landlord_driver.sleep(100)

      currentURL = await landlord_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    });


    it('Landlord Upload Quotation', async function () {
      const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
      await landlord_driver.executeScript("arguments[0].click();", lastTicket);
      const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
      await landlord_driver.executeScript("arguments[0].click();", detailsButton);

      await landlord_driver.manage().setTimeouts({implicit: 300});

      const addQuotationButton = landlord_driver.findElement(By.xpath("//button[text()='View/Add Quotation']"))
      await landlord_driver.executeScript("arguments[0].click();", addQuotationButton);

      let currentURL = await landlord_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/QuotationUploadPage/', currentURL)

      const chooseFileButton = landlord_driver.findElement(By.xpath("//input[@id='files']"))
      await chooseFileButton.sendKeys('C:/public/uploads/test.pdf')

      const uploadButton = landlord_driver.findElement(By.xpath("//button[text()='Upload Quotation']"))
      await uploadButton.click()

      await landlord_driver.sleep(200)
      currentURL = await landlord_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)
  
  });


  it('Tenant View Quotation', async function () {
    await tenant_driver.get('http://localhost:3000/pages/TicketList/');

    await tenant_driver.manage().setTimeouts({implicit: 300});

    const lastTicket = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    await tenant_driver.executeScript("arguments[0].click();", lastTicket);
    const detailsButton = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    await tenant_driver.executeScript("arguments[0].click();", detailsButton);

    const viewQuotationButton = tenant_driver.findElement(By.xpath("//button[text()='View/Add Quotation']"))
    await tenant_driver.executeScript("arguments[0].click();", viewQuotationButton);

    let currentURL = await tenant_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/pages/QuotationPage/', currentURL)
  });


  it('Tenant Approve Quotation', async function () {
    await tenant_driver.manage().setTimeouts({implicit: 300});
    const quotationCheckbox = tenant_driver.findElement(By.xpath("//*[@id='quotationCheckbox']"))
    await tenant_driver.executeScript("arguments[0].click();", quotationCheckbox);

    const approveButton = tenant_driver.findElement(By.xpath("//button[text()='Approve']"))
    await tenant_driver.executeScript("arguments[0].click();", approveButton);

    await tenant_driver.sleep(200)
    currentURL = await landlord_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)
  });


  it('Landlord Starts Work', async function () {
    await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    await tenant_driver.manage().setTimeouts({implicit: 300});

    const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    const startWorkButton = landlord_driver.findElement(By.xpath("//button[text()='Start Work']"))
    await landlord_driver.executeScript("arguments[0].click();", startWorkButton);

    await landlord_driver.sleep(200)
    let currentURL = await landlord_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/pages/TicketList', currentURL)
  });

  it('Landlord Ends Work', async function () {
    await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    await tenant_driver.manage().setTimeouts({implicit: 300});

    const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    const startWorkButton = landlord_driver.findElement(By.xpath("//button[text()='End Work']"))
    await landlord_driver.executeScript("arguments[0].click();", startWorkButton);

    await landlord_driver.sleep(200)
    let currentURL = await landlord_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/pages/TicketList', currentURL)
  });

  it('Tenant Give Feedback', async function () {
    await tenant_driver.get('http://localhost:3000/pages/TicketList/');

    await tenant_driver.manage().setTimeouts({implicit: 300});
    
    const lastTicket = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    await tenant_driver.executeScript("arguments[0].click();", lastTicket);
    const detailsButton = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    await tenant_driver.executeScript("arguments[0].click();", detailsButton);

    const feedbackButton = tenant_driver.findElement(By.xpath("//button[text()='Close Ticket & Give Feedback']"))
    await tenant_driver.executeScript("arguments[0].click();", feedbackButton);

    await tenant_driver.sleep(200)
    let currentURL = await tenant_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/pages/FeedbackForm/', currentURL)

    const feedbackText = tenant_driver.findElement(By.name('comment'))
    await feedbackText.sendKeys('Dummy Feedback Comment');

    const feedbackRating = tenant_driver.findElement(By.xpath("//*[@class='chakra-icon css-11w35xc']"))
    await feedbackRating.click();

    const submitButton = tenant_driver.findElement(By.xpath("//button[text()='Submit']"))
    await submitButton.click()

    await tenant_driver.sleep(200);

    currentURL = await tenant_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/pages/dashboard', currentURL)
  });


  it('Landlord View Feedback', async function () {
    const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    let result = await landlord_driver.wait(until.elementIsVisible(
      landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[3]/div/div[1]/textarea'))
      ));
    let feedback = await result.getText();
    assert.equal("Dummy Feedback Comment", feedback)
  });


  it('Landlord Sign Out', async function () {

    // Click on "Service Ticket List"
    let signout = await landlord_driver.wait(until.elementIsVisible(
      landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[3]/button'))
    ))
    await signout.click();
    await landlord_driver.manage().setTimeouts({implicit: 500});

    // Check if ticket portal is shown
    const currentURL = await landlord_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/', currentURL)
  });


  it('Tenant Sign Out', async function () {
    // Click on "Service Ticket List"
    let signout = await tenant_driver.wait(until.elementIsVisible(
      tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[3]/button'))
    ))
    await signout.click();
    await tenant_driver.manage().setTimeouts({implicit: 500});

    // Check if ticket portal is shown
    const currentURL = await tenant_driver.getCurrentUrl();
    assert.equal('http://localhost:3000/', currentURL)
  });




});
