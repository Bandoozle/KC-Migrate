import { FeatureSplit, type FeatureSplitData } from "@/components/sections/FeatureSplit";
import styles from "./FeatureSplitStack.module.css";

type FeatureSplitStackProps = {
  features: FeatureSplitData[];
};

/**
 * Sticky layered scroll for consecutive FeatureSplits.
 * Later panels rise from the bottom and cover earlier ones.
 */
function hasImage(feature: FeatureSplitData) {
  return Boolean(feature.image?.src);
}

function usesReveal(feature: FeatureSplitData) {
  return feature.motion === "reveal";
}

export function FeatureSplitStack({ features }: FeatureSplitStackProps) {
  if (features.length === 0) return null;

  const groups: FeatureSplitData[][] = [];
  for (const feature of features) {
    const previous = groups[groups.length - 1];
    if (
      previous &&
      hasImage(previous[0]) &&
      hasImage(feature) &&
      !usesReveal(previous[0]) &&
      !usesReveal(feature)
    ) {
      previous.push(feature);
      continue;
    }
    groups.push([feature]);
  }

  return (
    <>
      {groups.map((group, groupIndex) => {
        const stacked = group.length > 1 && hasImage(group[0]);
        if (!stacked) {
          return group.map((feature, index) => (
            <FeatureSplit
              key={`${feature.eyebrow || ""}-${feature.title}-${groupIndex}-${index}`}
              feature={feature}
            />
          ));
        }

        return (
          <div className={styles.stack} key={`stack-${groupIndex}`}>
            {group.map((feature, index) => (
              <FeatureSplit
                key={`${feature.eyebrow || ""}-${feature.title}-${index}`}
                feature={feature}
                stackIndex={index}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}
