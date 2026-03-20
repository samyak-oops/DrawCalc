# 🧠 DrawCalc — AI-Powered Handwritten Math Solver

DrawCalc is an AI-powered web application that interprets **hand-drawn mathematical expressions** and provides real-time solutions using modern web technologies and generative AI.

---
## 📸 Demo

### 🖌️ Drawing Input

<p align="center">
  <img src="./assets/input.png" alt="Drawing Input" width="80%"/>
</p>

### 🤖 AI Generated Solution

<p align="center">
  <img src="./assets/output.png" alt="AI Output" width="80%"/>
</p>


## 🚀 Features

* ✍️ Draw mathematical expressions on canvas
* 🤖 AI-based interpretation using Gemini API
* ⚡ Real-time calculation and results
* 📊 Supports:

  * Basic arithmetic
  * Algebraic equations
  * Variable assignments
  * Multi-step expressions
* 🎨 Clean and interactive UI

---

## 🛠️ Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* Axios

### Backend

* FastAPI
* Python
* Google Generative AI (Gemini)
* Pillow (Image Processing)

---

## 📁 Project Structure

```
DrawCalc/
 ├── DrawCalc-fe/      # Frontend (React)
 ├── DrawCalc-be/      # Backend (FastAPI)
 ├── .gitignore
 └── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Clone the repository

```
git clone https://github.com/your-username/drawcalc.git
cd drawcalc
```

---

### 🔹 Backend Setup

```
cd DrawCalc-be
pip install -r requirements.txt
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

Run server:

```
python -m uvicorn main:app --reload
```

---

### 🔹 Frontend Setup

```
cd DrawCalc-fe
npm install
npm run dev
```

---

## 🌐 Usage

1. Open the frontend in browser
2. Draw a mathematical expression
3. Click **Run**
4. View AI-generated results instantly

---

## ⚠️ Notes

* Ensure backend is running before using frontend
* Requires valid Gemini API key
* AI responses may vary slightly depending on input clarity

---

## 📌 Future Improvements

* 🧮 More advanced equation solving
* 📷 Image upload support
* 📱 Mobile responsiveness
* 🧠 Better handwriting recognition

---

## 👨‍💻 Author

**Your Name**

* GitHub: https://github.com/your-username

---

## ⭐ Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---

## 📄 License

This project is open-source and available under the MIT License.
