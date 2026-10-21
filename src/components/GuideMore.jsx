// "Read next" block for the guides: cluster ↔ cluster and cluster → pillar
// links in running text (Mak rule 9), with the target's own words as anchor.
const GUIDES = [
  ["/guide/hvor-ofte", "hvor ofte du bør vaske bilen"],
  ["/guide/salt-og-lak", "hvordan du beskytter lakken mod vejsalt"],
  ["/guide/dampvask-vs-traditionel", "forskellen på dampvask og traditionel bilvask"],
];
export default function GuideMore({ current }) {
  const others = GUIDES.filter(([href]) => href !== current);
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
