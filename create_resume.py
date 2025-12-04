from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.colors import black, blue, grey
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from datetime import datetime
import os

def create_resume_pdf():
    """Создает PDF резюме для Toleubayev Yershat"""
    
    # Создаем PDF файл
    pdf_path = "Toleubayev_Yershat_Resume.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=A4, topMargin=0.5*inch)
    
    # Получаем стили
    styles = getSampleStyleSheet()
    
    # Создаем пользовательские стили
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.black,
        alignment=1  # Центрирование
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=12,
        textColor=colors.blue,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        textColor=colors.black,
        fontName='Helvetica'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=20,
        textColor=colors.grey,
        fontName='Helvetica-Oblique',
        alignment=1  # Центрирование
    )
    
    # Содержимое документа
    story = []
    
    # Заголовок
    story.append(Paragraph("TOLEUBAYEV YERSHAT", title_style))
    story.append(Paragraph("Разработчик", subtitle_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Контактная информация
    contact_data = [
        ['Телефон:', '+77780958898'],
        ['GitHub:', 'https://github.com'],
        ['Email:', 'contact@example.com']
    ]
    
    contact_table = Table(contact_data, colWidths=[1.2*inch, 3*inch])
    contact_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    story.append(contact_table)
    story.append(Spacer(1, 0.3*inch))
    
    # О себе
    story.append(Paragraph("ПРОФЕССИОНАЛЬНАЯ ЦЕЛЬ", heading_style))
    about_text = """
    Разработчик с фокусом на адаптивные решения и инновационные технологии. 
    Активно изучаю современные технологии разработки и стремлюсь к постоянному 
    профессиональному росту. Особый интерес к работе с языковыми моделями (LM) 
    и внедрению решений на основе искусственного интеллекта.
    """
    story.append(Paragraph(about_text, normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Навыки
    story.append(Paragraph("КЛЮЧЕВЫЕ НАВЫКИ", heading_style))
    skills_data = [
        ['Технические навыки:', 'Адаптивность', 'Разработка веб-приложений'],
        ['Области экспертизы:', 'Работа с языковыми моделями', 'Современные технологии ИИ'],
        ['Профессиональные:', 'Проблемно-ориентированное мышление', 'Постоянное обучение']
    ]
    
    skills_table = Table(skills_data, colWidths=[2*inch, 2*inch, 2*inch])
    skills_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (2, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    
    story.append(skills_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Проекты
    story.append(Paragraph("ПРОЕКТЫ И ДОСТИЖЕНИЯ", heading_style))
    
    # Основной проект
    project_title = "<b>Проект по работе с языковыми моделями (LM)</b><br/>"
    project_desc = """
    Разработка и внедрение решений на основе современных технологий искусственного 
    интеллекта. Работа с языковыми моделями, включающая исследование различных 
    подходов к интеграции ИИ в приложения, тестирование и оптимизацию алгоритмов.
    """
    
    story.append(Paragraph(project_title + project_desc, normal_style))
    story.append(Spacer(1, 0.1*inch))
    
    # Технологии проекта
    tech_text = "<b>Технологии:</b> JavaScript, Python, API интеграции, современные фреймворки"
    story.append(Paragraph(tech_text, normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Опыт работы
    story.append(Paragraph("ОПЫТ РАБОТЫ", heading_style))
    experience_text = """
    <b>Самостоятельная разработка и изучение технологий</b><br/>
    • Изучение современных технологий разработки программного обеспечения<br/>
    • Практическое применение знаний в проектах<br/>
    • Постоянное отслеживание трендов в IT-индустрии<br/>
    • Развитие навыков в области веб-разработки и ИИ
    """
    story.append(Paragraph(experience_text, normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Образование
    story.append(Paragraph("ОБРАЗОВАНИЕ И РАЗВИТИЕ", heading_style))
    education_text = """
    <b>Самообразование и практический опыт</b><br/>
    • Изучение современных технологий разработки<br/>
    • Прохождение онлайн-курсов и изучение документации<br/>
    • Практические проекты и эксперименты с новыми технологиями<br/>
    • Участие в сообществах разработчиков
    """
    story.append(Paragraph(education_text, normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Личные качества
    story.append(Paragraph("ЛИЧНЫЕ КАЧЕСТВА", heading_style))
    qualities_text = """
    • <b>Адаптивность</b> - способность быстро приспосабливаться к новым технологиям и требованиям<br/>
    • <b>Проблемно-ориентированный подход</b> - умение находить эффективные решения<br/>
    • <b>Постоянное обучение</b> - стремление к развитию и изучению нового<br/>
    • <b>Внимание к деталям</b> - качественная реализация проектов<br/>
    • <b>Коммуникативность</b> - готовность к командной работе
    """
    story.append(Paragraph(qualities_text, normal_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Дата создания
    current_date = datetime.now().strftime("%B %Y")
    date_style = ParagraphStyle(
        'DateStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        alignment=1,  # Центрирование
        spaceBefore=20
    )
    
    story.append(Paragraph(f"Резюме создано: {current_date}", date_style))
    
    # Генерируем PDF
    doc.build(story)
    
    print(f"PDF резюме успешно создано: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    create_resume_pdf()