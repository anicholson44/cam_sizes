import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, Menu } from "semantic-ui-react";
import { RootState, CamStyle, EntityMap, Cam, IdStore, actions } from "../../store";
import CamStyleCheckbox from "./CamStyleCheckbox";
import CamMenuItem from "./CamMenuItem";

const ManufacturerMenuItem = ({ id }: { id: number }) => {
  const camStyles = useSelector<RootState, CamStyle[]>(({ entities }) =>
    entities.manufacturers[id].camStyles.map(id => entities.camStyles[id])
  );
  const cams = useSelector<RootState, EntityMap<Cam>>(
    ({ entities }) => entities.cams
  );
  const [activeAccordions, setActiveAccordions] = useState<IdStore<true>>({});
  const dispatch = useDispatch();

  return (
    <Accordion as={Menu} vertical>
      {camStyles.map(camStyle => {
        const active = activeAccordions[camStyle.id];
        return (
          <Menu.Item key={camStyle.id}>
            <CamStyleCheckbox {...camStyle} />
            <Accordion.Title
              active={active}
              content={camStyle.name}
              onClick={() => {
                const newActiveAccordions = { ...activeAccordions };
                if (active) {
                  delete newActiveAccordions[camStyle.id];
                } else {
                  newActiveAccordions[camStyle.id] = true;
                }
                setActiveAccordions(newActiveAccordions);
              }}
              onMouseEnter={() => dispatch(actions.highlightCamStyle(camStyle.id))}
              onMouseLeave={() => dispatch(actions.unhighlightCams())}
            />
            <Accordion.Content
              active={active}
              content={
                <div className="cam-list">
                  {camStyle.cams.map(id => (
                    <CamMenuItem
                      key={id}
                      {...cams[id]}
                    />
                  ))}
                </div>
              }
            />
          </Menu.Item>
        );
      })}
    </Accordion>
  );
};

export default ManufacturerMenuItem;
