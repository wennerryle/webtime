package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

var StatisticsCollectionName = "site_statistics"

func main() {
	app := pocketbase.New()

	app.OnBootstrap().BindFunc(func(be *core.BootstrapEvent) error {
		if err := be.Next(); err != nil {
			return err
		}

		if !be.App.HasTable(StatisticsCollectionName) {
			err := be.App.Save(getStatisticsCollection())

			if err != nil {
				log.Fatalf("Cannot initialize <%s> collection. Error:\n<%s>", StatisticsCollectionName, err)
			}
		}

		return nil
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func getStatisticsCollection() *core.Collection {
	collection := core.NewBaseCollection(StatisticsCollectionName)

	collection.Fields.Add(&core.AutodateField{
		Name:     "created",
		OnCreate: true,
	})

	collection.Fields.Add(
		&core.URLField{
			Name:     "url",
			Required: true,
		},
	)

	collection.Fields.Add(
		&core.TextField{
			Name:     "title",
			Required: true,
		},
	)

	collection.Fields.Add(&core.NumberField{
		Name:     "secondsSpended",
		Required: true,
	})

	return collection
}
