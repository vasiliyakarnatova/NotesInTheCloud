# NotesInTheCloud
## 🚀 First-Time Setup Instructions

Follow these steps to get the project up and running for the first time:

*All steps are executed in the root directory*
1. **Install all dependencies**  
   ```bash
   npm run install-all
2. **Start Docker containers**
    
    Make sure Docker is installed and running, then start the containers:
    ```bash
    npm run docker-container
3. **Run database migrations**

    After Docker is ready, apply any pending migrations:
    ```bash
    npm run migrate
## To start the project run this script in the main directory:
```bash
npm run dev