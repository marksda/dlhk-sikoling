import { CompoundButton, DefaultPalette, FontIcon, IStackItemStyles, Label, mergeStyles, mergeStyleSets, Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";

interface IFileUploadProps {
    limit: number;
    multiple: boolean;
    name: string;
    mime: string;
    disabled: boolean;
};

const stackHorTokens = { childrenGap: 8 };
const iconClass = mergeStyles({
    fontSize: 24,
    height: 24,
    width: 24,
    margin: '8px 0px 0px 0px',
});
const iconSmallClass = mergeStyles({
    fontSize: 16,
    height: 16,
    width: 16,
    margin: '4px 0px 0px 0px',
    cursor: 'pointer',
});
const classNames = mergeStyleSets({
    deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
    greyDark:[{ color: '#4C4A48' }, iconClass],
    greenDark:[{color: '#107C10'}, iconClass],
    redDarkSmall:[{ color: `${DefaultPalette.redDark}` }, iconSmallClass],
});
const stackItemStyles: IStackItemStyles = {
    root: {
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 8,
        marginTop: 4,
    },
};

export const FileUpload: FC<IFileUploadProps> = ({ limit, multiple, name, mime, disabled }) => {
    //reat-hook-Form Context
    const {
        control,
        formState: { isSubmitting, errors },
    } = useFormContext();
    //state 
    const { field } = useController({ name, control });
    const [singleFile, setSingleFile] = useState<File[]>([]);
    const [fileList, setFileList] = useState<File[]>([]);
    const compoundButtonId = useId('targetCompoundButton');

    const onFileDrop = useCallback(
        (e: React.SyntheticEvent<EventTarget>) => {
            const target = e.target as HTMLInputElement;
            if (!target.files) return;    
            if (limit === 1) {
                // console.log(target.files);
                const newFile = Object.values(target.files).map((file: File) => file);
                if (singleFile.length >= 1) {
                    return alert('Hanya satu file yang boleh diupload');
                }
                setSingleFile(newFile);
                field.onChange(newFile[0]);
            }    
            if (multiple == true) {
                const newFiles = Object.values(target.files).map((file: File) => file);
                if (newFiles) {
                    const updatedList = [...fileList, ...newFiles];                    
                    if (updatedList.length > limit || newFiles.length > 3) {
                        return alert(`Image must not be more than ${limit}`);
                    }
                    setFileList(updatedList);
                    field.onChange(updatedList);
                }
            }
        },
        [field, fileList, limit, multiple, singleFile]
    );

    const bindClickEventInputFile = useCallback(
        (e) => {            
            e.stopPropagation();
            document.getElementById('fileUpload')!.click();
        },
        []
    );

    const hapusFile = useCallback(
        (e) => {            
            // e.stopPropagation();
            // document.getElementById('fileUpload')!.click();
            // console.log(e.target.ariaLabel);
            if (multiple) {
                const updatedList = [...fileList];
                updatedList.splice(e.target.ariaLabel, 1);
                setFileList(updatedList);
                field.onChange(updatedList);
            } else {
                setSingleFile([]);
                field.onChange();
            }
        },
        [multiple, fileList, field]
    );


    return(
        <>
            
            {fileList.length > 0 || singleFile.length > 0 ? (
                <Stack styles={stackItemStyles}>
                    <Stack>
                        <Label>File di bawah ini akan diupload</Label>
                    </Stack>
                {
                    (multiple == true ? fileList:singleFile).map((item, index)=> {
                        return(
                            <Stack key={index} horizontal tokens={stackHorTokens}>
                                <Stack.Item>
                                    <FontIcon iconName="PDF" className={classNames.greenDark} />
                                </Stack.Item>
                                <Stack.Item align="center">
                                    {item.name}
                                </Stack.Item>
                                <Stack.Item align="center">
                                    <FontIcon 
                                        aria-label={`${index}`} 
                                        iconName="RemoveFilter" 
                                        className={classNames.redDarkSmall} 
                                        onClick={hapusFile}/>
                                </Stack.Item>
                            </Stack>                            
                        );
                    })                  
                }
                </Stack>    
            ):(
                <CompoundButton
                    id={compoundButtonId}
                    secondaryText='click untuk memasukkan file yang akan diupload'
                    onClick={bindClickEventInputFile}
                    styles={{
                        root: {
                            minWidth: 450,
                            marginTop: 4,
                            borderColor: DefaultPalette.orangeLighter
                        }
                    }}
                    disabled={disabled}
                >
                    File
                </CompoundButton>      
            )}
            <Controller 
                name={name}
                defaultValue=''
                control={control}
                render={({ field: { name, onBlur, ref } }) => (
                    <input
                        id='fileUpload'
                        type='file'
                        name={name}
                        onBlur={onBlur}
                        ref={ref}
                        onChange={onFileDrop}
                        multiple={multiple}
                        accept={mime}
                        style={{
                            opacity: 1,
                            position: 'relative',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            display: 'none'
                        }}
                    />
                )}
            />
        </>
    );
}