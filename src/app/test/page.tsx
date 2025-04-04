import FirebaseTest from '../firebase-test';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Integration Tests</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <FirebaseTest />
      </div>
    </div>
  );
} 