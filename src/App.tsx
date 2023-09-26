import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const me = [
  -1.029298186302185, 0.7718870639801025, -0.10710035264492035,
  -0.12655186653137207, 1.917115569114685, -0.622790515422821,
  -0.7129611968994141, 0.47073936462402344, 0.5596755743026733,
  0.348541796207428, 0.3180134892463684, 0.6127383708953857,
  0.03762044012546539, 0.6708827018737793, 0.06983019411563873,
  1.1063270568847656, 0.16270986199378967, 0.9951052665710449,
  1.238316535949707, -0.006474165245890617, -0.48475444316864014,
  -0.8838110566139221, -0.2679062485694885, 0.7174054980278015,
  -1.271033525466919, -0.7500956654548645, -0.9922813773155212,
  0.27845120429992676, -1.710753083229065, -0.5393712520599365,
  -0.8546667098999023, -0.5306832194328308, -0.7767398357391357,
  -0.8227740526199341, 0.12045815587043762, 1.6638479232788086,
  1.61698579788208, 0.9689802527427673, 1.6698081493377686, 0.48306983709335327,
  1.821710467338562, 0.9592621922492981, 1.427367091178894, 1.0680794715881348,
  -0.8864221572875977, 0.7068891525268555, -0.7168095707893372,
  -0.8054323196411133, -1.3401596546173096, 0.2921343743801117,
  -1.7486298084259033, 2.412203073501587, -1.2545201778411865,
  1.107999563217163, -0.6994768381118774, 1.3368347883224487,
  -0.5357247591018677, -0.19563786685466766, 0.017415851354599,
  -0.016497794538736343, 1.6922022104263306, 1.1528083086013794,
  -0.1442577838897705, 0.43735140562057495, -0.030694834887981415,
  1.8384300470352173, 0.5090539455413818, 1.330183744430542,
  0.26053282618522644, 1.3694168329238892, 0.43006324768066406,
  2.009645462036133, -0.21700264513492584, 1.2227978706359863,
  -0.132656067609787, 0.3847562074661255, -0.38505861163139343,
  -0.32214829325675964, -2.166943073272705, -0.25405871868133545,
  -0.07676409184932709, -0.704426646232605, 0.03725716844201088,
  1.6301603317260742, -0.025260642170906067, -0.9952834844589233,
  0.5936028361320496, -0.543323814868927, -1.8698794841766357,
  -0.6263591647148132, -0.16413074731826782, -1.092274785041809,
  1.120989203453064, 0.2024877369403839, -1.9713129997253418,
  -0.7341901063919067, 0.24023953080177307, -0.13575491309165955,
  -1.656214714050293, 0.442559152841568, -2.1839964389801025,
  1.3178935050964355, -1.3008062839508057, -2.2370028495788574,
  0.22755742073059082, -0.8431629538536072, -0.6623611450195312,
  -1.055996298789978, -0.410910427570343, 2.250469446182251, 0.8979087471961975,
  1.103482723236084, 1.8685952425003052, 0.1113465204834938,
  -1.4888840913772583, 0.9480098485946655, -0.4590718746185303,
  -0.06341737508773804, -1.0945630073547363, 0.2631419003009796,
  -1.3154819011688232, 0.6267600059509277, 2.2562663555145264,
  -0.7828025817871094, 0.5165409445762634, -1.5454356670379639,
  1.3429923057556152, 0.2602427005767822,
];

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  supabase
    .rpc("match_documents3", {
      query_embedding: me,
      match_threshold: 0.5,
      match_count: 10,
    })
    .then((d) => {
      console.log(d);
    });

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <div>Logged in!</div>;
  }
}
