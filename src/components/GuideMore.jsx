"use client";
import { useLang } from "@/lib/useLang";

// "Read next" block for the guides: cluster ↔ cluster and cluster → pillar
// links in running text (Mak rule 9), with the target's own words as anchor.
const GUIDES = [
  ["/guide/hvor-ofte", "hvor ofte du bør vaske bilen", "how often you should wash your car"],
  ["/guide/salt-og-lak", "hvordan du beskytter lakken mod vejsalt", "how to protect the paint from road salt"],
  ["/guide/dampvask-vs-traditionel", "forskellen på dampvask og traditionel bilvask", "the difference between steam washing and a traditional car wash"],
];
export default function GuideMore({ current }) {
  const others = GUIDES.filter(([href]) => href !== current);
  if (useLang() === "en") {
    return (
      <>
        <h2>Read also</h2>
        <p>
          Read also about <a href={others[0][0]}>{others[0][2]}</a> and about{" "}
          <a href={others[1][0]}>{others[1][2]}</a>. All our advice is collected in our{" "}
          <a href="/guide">car care guide</a>, and you can find the price for your car under{" "}
          <a href="/priser">mobile steam wash prices</a>.
        </p>
      </>
    );
  }
  return (
    <>
      <h2>Læs også</h2>
      <p>
        Læs også om <a href={others[0][0]}>{others[0][1]}</a> og om{" "}
        <a href={others[1][0]}>{others[1][1]}</a>. Alle råd er samlet i vores{" "}
        <a href="/guide">bilpleje-guide</a>, og prisen for din bil finder du under{" "}
        <a href="/priser">priser på mobil dampvask</a>.
      </p>
    </>
  );
}
