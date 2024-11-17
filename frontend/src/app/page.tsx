export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <h1 className="text-3xl font-bold">
        Welcome to the Alpaca Health Platform Take-Home Project
      </h1>

      <p className="max-w-lg text-lg">
        This is your starting point. Please replace this page with your own
        implementation following the project requirements.
      </p>

      <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
        <p className="text-sm">
          Tip: Edit{" "}
          <code className="rounded bg-yellow-100 px-1 py-0.5 font-mono">
            src/app/page.tsx
          </code>{" "}
          to get started
        </p>
      </div>

      <footer className="fixed bottom-4 text-sm text-gray-500">
        <p>Good luck with your implementation!</p>
      </footer>
    </div>
  );
}
