import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

export default function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled = false,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    // console.log(formData[getControlItem.name]);
    // console.log(formData);
    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
          />
        );
        break;

      case "select":
        element = (
          <Select
            value={value}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={getControlItem.placeholder || "Select Option"}
              />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="system">System</SelectItem> */}
              {getControlItem?.options.length &&
                getControlItem.options?.map((optionItem, i) => (
                  <SelectItem key={i} value={optionItem.value} id={i}>
                    {optionItem.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          ></Textarea>
        );
        break;
      default:
        element = (
          <input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  }
  return (
    <form action="" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div key={controlItem.name} className="grid w-full gap-1.5">
            <Label htmlFor="" className="mb-1">
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button className="mt-4 w-full" type="submit" disabled={isBtnDisabled}>
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
