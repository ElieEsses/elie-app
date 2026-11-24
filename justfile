# list available commands
default:
    @just --list

# run ESlint linter with auto-fix
lint:
    npm run lint -- --fix

# run Prettier formatter
format:
    npx prettier --write src/
    
# lint and format
check: lint format
    
# start dev server
run:
    npm run dev

# run buid 
build:
    npm run build

# start cloudflare tunnel
tunnel:
    cloudflared tunnel --url http://localhost:5173

# deploy with an optional commit message
deploy message="Update":
    ./dev/deploy.sh "{{message}}"