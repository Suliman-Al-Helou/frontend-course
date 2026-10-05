// ألوان الكود كلها من tokens المشروع (بدون ألوان جديدة)
type Token = { t: string; c?: string };
type Line = Token[];

const K = "text-primary";            // keywords
const S = "text-success";            // strings / comments
const N = "text-warning";            // numbers
const M = "text-muted-foreground";   // comments

const LINES: Line[] = [
  [{ t: "def ", c: K }, { t: "binary_search(arr, target):" }],
  [{ t: "    left, right = " }, { t: "0", c: N }, { t: ", len(arr) - " }, { t: "1", c: N }],
  [{ t: "    while ", c: K }, { t: "left <= right:" }],
  [{ t: "        mid = (left + right) // " }, { t: "2", c: N }],
  [{ t: "        if ", c: K }, { t: "arr[mid] == target:" }],
  [{ t: "            return ", c: K }, { t: "mid  " }, { t: "# found the target", c: M }],
  [{ t: "        elif ", c: K }, { t: "arr[mid] < target:" }],
  [{ t: "            left = mid + " }, { t: "1", c: N }],
  [{ t: "        else", c: K }, { t: ":" }],
  [{ t: "            right = mid - " }, { t: "1", c: N }],
  [{ t: "    return ", c: K }, { t: "-1  " }, { t: "# not found", c: M }],
  
];

export default function HeroCodeCard() {
  return (
    // dir="ltr" لأن الكود يُكتب دائمًا من اليسار لليمين حتى في الصفحة العربية
    <div
      dir="ltr"
      aria-hidden="true"
      className="w-full max-w-lg overflow-hidden rounded-md border border-gray-600  bg-[#0c0f16] shadow-sm "
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#040811] relative">
        <span className="h-[1px] top-11 m-auto  w-114 bg-gray-600 absolute "></span>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-destructive" />
            <span className="size-2 rounded-full bg-warning" />
            <span className="size-2 rounded-full bg-success" />
          </div>
          <span className="text-sm text-white font-bold">main.py</span>
        </div>
        <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-white">
          Python
        </span>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-7">
        {LINES.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-4 select-none text-end text-muted-foreground/60">
              {i + 1}
            </span>
            <code className="whitespace-pre">
              {line.map((tok, j) => (
                <span key={j} className={tok.c}>
                  {tok.t}
                </span>
              ))}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}