# AgentBee Search Widget

A React + Vite widget for displaying linked incidents and authorised agents from the AgentBee incident management system.

## Features

- **Linked Incidents View**: Shows non-authorised incidents linked to an institution
- **Authorised Agents View**: Shows authorised education agents for an institution
- **Severity Indicators**: Color-coded severity badges (Red/Amber/Green)
- **Responsive Design**: Works in iframes and standalone

## Usage

### Linked Incidents Widget

```html
<iframe 
  src="https://your-vercel-url.vercel.app/?id=37dab7bb-8b27-4a60-928a-d353a7b3fadb&type=linked" 
  width="100%" 
  height="900" 
  frameborder="0" 
  style="border:none;border-radius:8px;">
</iframe>
```

### Authorised Agents Widget

```html
<iframe 
  src="https://your-vercel-url.vercel.app/?id=37dab7bb-8b27-4a60-928a-d353a7b3fadb&type=authorised" 
  width="100%" 
  height="900" 
  frameborder="0" 
  style="border:none;border-radius:8px;">
</iframe>
```

## Parameters

- `id` (required): Institution UUID
- `type` (optional): `linked` or `authorised` (defaults to `linked`)
- `backend` (optional): Backend API URL (defaults to `https://incident-admin-tool.manus.space`)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com/dashboard
3. Click "Add New..." → "Project"
4. Import this GitHub repo
5. Click "Deploy"

Vercel will automatically build and deploy the widget.
