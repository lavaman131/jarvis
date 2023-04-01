## 💻 Getting Started Locally Debugging
### Clone this Repo:
```bash
git clone https://github.com/lavaman131/jarvis.git
```
### Setup OpenAI API key:
https://elephas.app/blog/how-to-create-openai-api-keys-cl5c4f21d281431po7k8fgyol0

### Setup .env file to store API key and keep safe:
```bash
echo "OPENAI_API_KEY={Put Your API Key Here}" > backend/app/.env
```
### Run the backend server:
1. Go to the backend folder:
```bash
cd backend
```
2. Create virtual environment and install 🐍 Python dependencies:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
3. Initialize the backend server:
```bash
cd app
uvicorn api:app --host 0.0.0.0 --port 8080
```
### Run the frontend:
1. Go to the frontend folder:
```bash
cd frontend
```
2. Install npm dependencies:
```bash
npm i
```
3. Initialize frontend:
```bash
npm run dev
```
### Load the website:
http://localhost:3000/

## 🪲 Find the bug in the code
### Tips:
* Use print statements
* Try using a debugger to step through your code
* Check the console of your browser for logs
