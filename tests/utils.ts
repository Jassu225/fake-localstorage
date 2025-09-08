export function waitForCalls(
  mockFn: jest.Mock,
  expectedCalls: number,
  timeout = 5000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkCalls = () => {
      if (mockFn.mock.calls.length >= expectedCalls) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(
          new Error(
            `Timeout: Expected ${expectedCalls} calls, got ${mockFn.mock.calls.length}`
          )
        );
      } else {
        setTimeout(checkCalls, 10); // Check every 10ms
      }
    };

    checkCalls();
  });
}
