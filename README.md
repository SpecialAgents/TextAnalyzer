
# Camden Intelligence - Sentiment Analytics Dashboard

Camden Intelligence is a state-of-the-art sentiment analysis system designed to transform raw text into actionable emotional intelligence. Leveraging the power of the Gemini 3 Flash API, it provides multi-class classification, driver extraction, and sophisticated data visualization.

## 🚀 Key Features

- **High-Fidelity Analysis**: Classifies text into Positive, Negative, or Neutral with confidence scoring.
- **Deep Insights**: Automatically extracts keywords and provides an AI-generated rationale for every analysis.
- **Batch Processing**: Analyze multiple nodes simultaneously via CSV or TXT file uploads (optimized for 15+ entries).
- **Interactive Visualizations**: Real-time sentiment distribution and volume breakdown charts.
- **Accuracy Reporting**: Integrated performance monitoring with confusion matrices and comparative analysis.
- **Multi-Format Export**: Export your data and insights as PDF, CSV, or JSON.

## 🛠️ Tech Stack

- **Frontend**: React 19 (ESM based)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Sage/Olive Matrix Theme)
- **Intelligence Engine**: Google Gemini 3 Flash API
- **Visuals**: Recharts
- **Document Generation**: jsPDF & jsPDF-AutoTable

## 📖 User Guide

### 1. Launching the Console
Click the "Launch Camden Console" button from the landing page to access the main dashboard.

### 2. Performing Analysis
- **Direct Entry**: Paste your text source directly into the intelligence console.
- **Batch Matrix**: Drag and drop a `.csv` or `.txt` file into the upload zone for rapid sequence analysis.

### 3. Reviewing Insights
Scroll through the "Layered Decryption Table" to see the vector (sentiment), fidelity (confidence), and reasoning behind each node.

### 4. Exporting Reports
Use the "Security Export" section to save your datasets. You can also generate comprehensive PDF reports for the Accuracy Matrix and Documentation sections.

## 📊 Model Limitations
- **Thresholds**: We recommend a confidence threshold of **0.65** for automated workflows.
- **Context**: The model may struggle with extreme sarcasm or highly localized idioms.
- **Length**: Optimal analysis is achieved with texts between 10 and 500 words.

---
Built for precision and insight. © 2024 Camden Intelligence AI.
