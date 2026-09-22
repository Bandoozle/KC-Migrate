import { FeatureSplit, type FeatureSplitData } from "@/components/sections/FeatureSplit";
import styles from "./FeatureSplitStack.module.css";

type FeatureSplitStackProps = {
  features: FeatureSplitData[];
};

/**
 * Sticky layered scroll for consecutive FeatureSplits.
 * Later panels rise from the bottom and cover earlier ones.
 */
export function FeatureSplitStack({ features }: FeatureSplitStackProps) {
  if (features.length === 0) return null;

  if (features.length === 1) {
    return <FeatureSplit feature={features[0]} />;
  }

  return (
    <div className={styles.stack}>
      {features.map((feature, index) => (
        <FeatureSplit
          key={`${feature.eyebrow || ""}-${feature.title}-${index}`}
          feature={feature}
          stackIndex={index}
        />
      ))}
    </div>
  );
}
