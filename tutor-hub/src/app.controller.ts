import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email.service';
import Handlebars from 'handlebars';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async sendEmail() {
    const template = `
      <h1>Congratulations, {{winnerName}}!</h1>
      <p>You have won the tender for "{{tenderName}}".</p>
    `;

    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Define the data
    const data = {
      winnerName: 'Acme Corp.',
      tenderName: 'Smart City Development Project',
    };

    // Generate the HTML
    const output = compiledTemplate(data);
    return await this.emailService.sendEmailWithResend(
      'hermongetachew10@gmail.com',
      'Test Email',
      output,
    );
  }
}
