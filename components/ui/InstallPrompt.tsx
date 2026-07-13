'use client';

import { Share, Smartphone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export default function InstallPrompt() {
    const { t } = useTranslation('common');
    const { visible, iosDialogOpen, setIosDialogOpen, install, dismiss, isIOS } = usePwaInstall();

    if (!visible) return null;

    return (
        <>
            <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 text-sm">
                <Smartphone className="mt-0.5 size-5 shrink-0 text-blue-500" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                        <p className="font-medium text-foreground">{t('install.bannerTitle')}</p>
                        <p className="text-muted-foreground">{t('install.bannerDescription')}</p>
                    </div>
                    <Button size="sm" onClick={() => void install()}>
                        {t('install.installButton')}
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="-mr-1 -mt-1 shrink-0"
                    onClick={dismiss}
                    aria-label={t('install.dismiss')}
                >
                    <X className="size-4" />
                </Button>
            </div>

            {isIOS && (
                <Dialog open={iosDialogOpen} onOpenChange={setIosDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('install.iosDialogTitle')}</DialogTitle>
                            <DialogDescription className="sr-only">
                                {t('install.iosDialogTitle')}
                            </DialogDescription>
                        </DialogHeader>
                        <ol className="list-none space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-medium text-blue-500">
                                    1
                                </span>
                                <span className="flex items-center gap-2 pt-0.5">
                                    {t('install.iosStep1')}
                                    <Share className="size-4 text-muted-foreground" />
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-medium text-blue-500">
                                    2
                                </span>
                                <span className="pt-0.5">{t('install.iosStep2')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-medium text-blue-500">
                                    3
                                </span>
                                <span className="pt-0.5">{t('install.iosStep3')}</span>
                            </li>
                        </ol>
                        <DialogFooter>
                            <Button onClick={() => setIosDialogOpen(false)}>
                                {t('install.iosGotIt')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
